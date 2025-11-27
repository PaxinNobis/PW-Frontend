import { useEffect, useState, useRef } from "react"
import ChatMessage from "./ChatMessage"
import ChatBar from "./ChatBar"
import ProgressBar from "./ProgressBar"
import { connectToChat, disconnectFromChat, onNewMessage, onHistory, onUserJoined, onUserLeft, clearCallbacks } from "../../services/chat.service"
import type { Message } from "../../GlobalObjects/Objects_DataTypes"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
import "./ChatSection.css"

interface ChatSectionProps {
    GetUser : () => User | null
    stream : Stream
}

const MAX_MESSAGES = 200

const ChatSection = (props: ChatSectionProps) => {
    const [messages, setMessages] = useState<Message[]>(props.stream.messagelist)
    const [pointsEarned, setPointsEarned] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messageKeysRef = useRef<Set<string>>(new Set())
    const user = props.GetUser()

    const buildMessageKey = (id?: string, createdAt?: string, fallback?: string) => {
        if (id) return id
        if (createdAt) return `${createdAt}`
        return fallback ?? `${Date.now()}-${Math.random()}`
    }

    const appendMessageIfNew = (msg: Message, key?: string) => {
        const messageKey = key ?? buildMessageKey(undefined, undefined, `${msg.hora}-${msg.user.name}-${msg.texto}`)
        if (messageKeysRef.current.has(messageKey)) {
            return
        }
        messageKeysRef.current.add(messageKey)
        setMessages(prev => {
            const next = [...prev, msg]
            if (next.length > MAX_MESSAGES) {
                return next.slice(next.length - MAX_MESSAGES)
            }
            return next
        })
    }

    // Función para agregar mensaje local
    const handleLocalMessage = (data: { texto: string; hora: string; user: User }) => {
        const newMessage: Message = {
            texto: data.texto,
            hora: data.hora,
            user: data.user
        }
        appendMessageIfNew(newMessage)
        
        // Simular ganancia de puntos localmente
        setPointsEarned(prev => prev + 1)
    }

    // Auto-scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Conectar al WebSocket del chat
    useEffect(() => {
        if (!user) return

        const streamerNickname = props.stream.user.name; // Usar el nombre del streamer

        // Limpiar mensajes anteriores
        setMessages([])
        messageKeysRef.current.clear()
        const unsubscribes: Array<() => void> = []
        
        try {
            connectToChat(streamerNickname)

            // Escuchar historial de mensajes
            const handleHistory = (historyMessages: any[]) => {
                if (!Array.isArray(historyMessages) || historyMessages.length === 0) {
                    return
                }
                const deduped: { msg: Message; key: string }[] = []
                historyMessages.forEach((data) => {
                    const msgKey = buildMessageKey(data.message.id, data.message.createdAt, `${data.message.texto}-${data.message.hora}`)
                    if (messageKeysRef.current.has(msgKey)) {
                        return
                    }
                    messageKeysRef.current.add(msgKey)
                    deduped.push({
                        msg: {
                            texto: data.message.texto,
                            hora: data.message.hora,
                            user: data.message.user
                        },
                        key: msgKey
                    })
                })
                if (deduped.length > 0) {
                    const limited = deduped.slice(-MAX_MESSAGES)
                    messageKeysRef.current = new Set(limited.map(item => item.key))
                    setMessages(limited.map(item => item.msg))
                }
            }
            const unsubscribeHistory = onHistory(handleHistory)
            if (unsubscribeHistory) unsubscribes.push(unsubscribeHistory)

            // Escuchar nuevos mensajes
            const handleNewMessage = (data: any) => {
                const msgKey = buildMessageKey(data.message.id, data.message.createdAt, `${data.message.texto}-${data.message.hora}`)
                const newMessage: Message = {
                    texto: data.message.texto,
                    hora: data.message.hora,
                    user: {
                        id: data.message.user.id,
                        name: data.message.user.name,
                        email: '',
                        password: '',
                        coins: 0,
                        pfp: data.message.user.pfp,
                        online: true,
                        bio: '',
                        followed: [],
                        followers: [],
                        friends: [],
                        pointsrecieved: [],
                        messagessent: [],
                        medalsrecieved: [],
                        streaminghours: 0,
                        streamerlevel: { id: 1, level: "Astronauta Novato", min_followers: 0, max_followers: 100, min_hours: 0, max_hours: 50 },
                        medalsforviewers: [],
                        clips: [],
                        xlink: '',
                        youtubelink: '',
                        instagramlink: '',
                        tiktoklink: '',
                        discordlink: ''
                    }
                }
                appendMessageIfNew(newMessage, msgKey)
                
                // Mostrar puntos ganados si es el usuario actual
                if (data.message.userId === user.id && data.pointsEarned > 0) {
                    setPointsEarned(prev => prev + data.pointsEarned)
                }
            }
            const unsubscribeNewMessage = onNewMessage(handleNewMessage)
            if (unsubscribeNewMessage) unsubscribes.push(unsubscribeNewMessage)

            // Escuchar cuando alguien se une
            const unsubscribeJoin = onUserJoined(() => undefined)
            if (unsubscribeJoin) unsubscribes.push(unsubscribeJoin)

            // Escuchar cuando alguien se va
            const unsubscribeLeave = onUserLeft(() => undefined)
            if (unsubscribeLeave) unsubscribes.push(unsubscribeLeave)
        } catch (error) {
            console.error('Error al conectar WebSocket:', error)
            console.warn('Continuando sin WebSocket. Los mensajes solo se verán localmente.')
        }

        return () => {
            clearCallbacks()
            disconnectFromChat()
            unsubscribes.forEach(unsubscribe => {
                try {
                    unsubscribe?.()
                } catch (err) {
                    console.error('Error al limpiar listeners de chat:', err)
                }
            })
        }
    }, [props.stream.user.name, user?.id])

    return(
        <div className="RightSide">
            <div className="ChatTitle">
                {user ? 
                    <ProgressBar 
                        actual={user.messagessent?.[props.stream.user.id]?.[0] ?? 0} 
                        max={user.medalsrecieved?.[0]?.[0].max_messages ?? 0} 
                        topic={"mensajes"} 
                    /> 
                    : ""}
                {pointsEarned > 0 && (
                    <div className="badge bg-success ms-2">
                        +{pointsEarned} puntos
                    </div>
                )}
            </div>
            <div className="RightSideScroll">
                {
                    messages.map((mensaje : Message, index: number) => {
                        return(
                            <ChatMessage key={`msg-${index}`} mensaje={mensaje} />
                        )
                    })
                }
                <div ref={messagesEndRef} />
            </div>
            <ChatBar 
                stream={props.stream} 
                GetUser={props.GetUser} 
                streamerId={props.stream.user.id}
                onLocalMessage={handleLocalMessage}
            />
        </div>
    )
}
export default ChatSection