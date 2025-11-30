import { useEffect, useState, useRef, useMemo } from "react"
import ChatMessage from "./ChatMessage"
import ChatBar from "./ChatBar"
import ProgressBar from "./ProgressBar"
import LevelUpModal from "./LevelUpModal"
import { connectToChat, disconnectFromChat, onNewMessage, onHistory, onUserJoined, onUserLeft, clearCallbacks } from "../../services/chat.service"
import type { Message } from "../../GlobalObjects/Objects_DataTypes"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
import "./ChatSection.css"
import { getStreamerLoyaltyLevels, type LoyaltyLevel } from "../../services/loyalty.service"
import { getUserPoints } from "../../services/points.service"

interface ChatSectionProps {
    GetUser: () => User | null
    stream: Stream
    doChatting: (message: Message, stream: Stream) => void
}

const MAX_MESSAGES = 200

const ChatSection = (props: ChatSectionProps) => {
    const [messages, setMessages] = useState<Message[]>(props.stream.messagelist)
    const [pointsEarned, setPointsEarned] = useState(0)
    const [showPointsBadge, setShowPointsBadge] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messageKeysRef = useRef<Set<string>>(new Set())
    const user = props.GetUser()
    const doChattingRef = useRef(props.doChatting)
    const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>([]);
    const [currentPoints, setCurrentPoints] = useState<number>(0);

    // Level Up Modal State
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [newLevelData, setNewLevelData] = useState<{ name: string; number: number } | null>(null);
    const previousLevelIdRef = useRef<number | null>(null);

    // Refs to access latest state inside useEffect without re-triggering it
    const loyaltyLevelsRef = useRef<LoyaltyLevel[]>([]);
    const currentPointsRef = useRef<number>(0);

    useEffect(() => {
        loyaltyLevelsRef.current = loyaltyLevels;
    }, [loyaltyLevels]);

    useEffect(() => {
        currentPointsRef.current = currentPoints;
    }, [currentPoints]);

    useEffect(() => {
        doChattingRef.current = props.doChatting
    }, [props.doChatting])

    // Fetch loyalty levels and points
    useEffect(() => {
        const fetchData = async () => {
            if (props.stream.user.id) {
                try {
                    console.log(`Fetching loyalty levels for streamer: ${props.stream.user.id}`);
                    const levels = await getStreamerLoyaltyLevels(props.stream.user.id.toString());
                    console.log("Loyalty levels fetched:", levels);
                    const sortedLevels = levels.sort((a, b) => a.puntosRequeridos - b.puntosRequeridos);
                    setLoyaltyLevels(sortedLevels);

                    if (user) {
                        const pointsData = await getUserPoints();
                        console.log("User points fetched:", pointsData);
                        const streamerId = String(props.stream.user.id);
                        console.log("Looking for streamerId:", streamerId);
                        console.log("Available streamerIds:", pointsData.byStreamer.map(p => String(p.streamerId)));
                        const streamerPoints = pointsData.byStreamer.find(
                            p => String(p.streamerId) === streamerId
                        );
                        console.log("Points for this streamer:", streamerPoints);
                        const points = streamerPoints ? streamerPoints.points : 0;
                        console.log(`Setting currentPoints to: ${points} (${streamerPoints ? 'from backend' : 'default 0'})`);
                        setCurrentPoints(points);

                        // Initialize previous level ref to avoid immediate popup on load
                        if (sortedLevels.length > 0) {
                            let initialLevelId = 0; // Start at 0 (Espectador/no level)
                            for (let i = 0; i < sortedLevels.length; i++) {
                                if (points >= sortedLevels[i].puntosRequeridos) {
                                    initialLevelId = sortedLevels[i].id || (i + 1);
                                } else {
                                    break;
                                }
                            }
                            previousLevelIdRef.current = initialLevelId;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching loyalty data:", error);
                }
            }
        };
        fetchData();
    }, [props.stream.user.id, user?.id]);

    // Detect Level Up
    useEffect(() => {
        if (loyaltyLevels.length === 0 || previousLevelIdRef.current === null) return;

        let currentLevel = null;
        let currentLevelId = 1;

        for (let i = 0; i < loyaltyLevels.length; i++) {
            if (currentPoints >= loyaltyLevels[i].puntosRequeridos) {
                currentLevel = loyaltyLevels[i];
                currentLevelId = loyaltyLevels[i].id || (i + 1);
            } else {
                break;
            }
        }

        if (currentLevel && currentLevelId > previousLevelIdRef.current) {
            console.log(`Level Up Detected! From ${previousLevelIdRef.current} to ${currentLevelId}`);
            setNewLevelData({
                name: currentLevel.nombre,
                number: currentLevelId
            });
            setShowLevelUpModal(true);
            previousLevelIdRef.current = currentLevelId;
        } else if (currentLevelId < previousLevelIdRef.current) {
            // Handle case where points might have been reset or error, sync ref down
            previousLevelIdRef.current = currentLevelId;
        }

    }, [currentPoints, loyaltyLevels]);

    const progress = useMemo(() => {
        const getViewerProgress = () => {
            if (!user) return { current: 0, max: 0, topic: "puntos" };

            const points = currentPoints;

            if (loyaltyLevels.length === 0) return { current: points, max: points, topic: "puntos" };

            let currentLvl = null;
            let nextLvl = null;

            for (let i = 0; i < loyaltyLevels.length; i++) {
                if (points >= loyaltyLevels[i].puntosRequeridos) {
                    currentLvl = loyaltyLevels[i];
                } else {
                    nextLvl = loyaltyLevels[i];
                    break;
                }
            }

            if (!nextLvl) {
                return {
                    current: points,
                    max: points,
                    topic: `puntos (Nivel Máximo: ${currentLvl?.nombre || 'Leyenda'})`
                };
            }

            return {
                current: points,
                max: nextLvl.puntosRequeridos,
                topic: `puntos para ${nextLvl.nombre}`
            };
        };

        return getViewerProgress();
    }, [currentPoints, loyaltyLevels, user]);

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
                    console.log("History message data:", data.message);
                    deduped.push({
                        msg: {
                            texto: data.message.texto,
                            hora: data.message.hora,
                            user: data.message.user,
                            level: data.message.user?.level || data.message.level || 1,
                            levelName: data.message.user?.levelName || data.message.levelName
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
            const handleNewMessage = async (data: any) => {
                const msgKey = buildMessageKey(data.message.id, data.message.createdAt, `${data.message.texto}-${data.message.hora}`)
                // Calculate dynamic level for current user
                // Priority: Backend provided level -> Local calculation -> Default
                let dynamicLevel = data.message.user?.level || data.message.level;
                let dynamicLevelName = data.message.user?.levelName || data.message.levelName;

                console.log("Backend Data Received:", data);
                console.log("Points Earned:", data.pointsEarned);

                // Only calculate locally if backend didn't provide the level (fallback)
                if (!dynamicLevel && data.message.userId === user.id) {
                    const currentPointsVal = currentPointsRef.current;
                    const loyaltyLevelsVal = loyaltyLevelsRef.current;

                    const newPoints = currentPointsVal + (data.pointsEarned || 0);

                    // Find level based on new points
                    let calculatedLevel = null;
                    for (let i = 0; i < loyaltyLevelsVal.length; i++) {
                        if (newPoints >= loyaltyLevelsVal[i].puntosRequeridos) {
                            calculatedLevel = loyaltyLevelsVal[i];
                        } else {
                            break;
                        }
                    }
                    if (calculatedLevel) {
                        dynamicLevel = calculatedLevel.id || 1;
                        dynamicLevelName = calculatedLevel.nombre;
                        console.log(`Level updated locally (fallback): ${dynamicLevelName} (${newPoints} points)`);
                    }
                }

                const newMessage: Message = {
                    texto: data.message.texto,
                    hora: data.message.hora,
                    level: dynamicLevel,
                    levelName: dynamicLevelName,
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
                console.log("New Message constructed:", newMessage);
                appendMessageIfNew(newMessage, msgKey)

                // Mostrar puntos ganados si es el usuario actual
                console.log("Checking points update:", {
                    messageUserId: data.message.userId,
                    currentUserId: user.id,
                    pointsEarned: data.pointsEarned,
                    match: String(data.message.userId) === String(user.id)
                });

                if (String(data.message.userId) === String(user.id)) {
                    if (data.pointsEarned && data.pointsEarned > 0) {
                        console.log(`Earned ${data.pointsEarned} points from message (optimistic update)`);

                        // Update points optimistically
                        setPointsEarned(data.pointsEarned)
                        setCurrentPoints(prev => {
                            const newPoints = prev + data.pointsEarned;
                            console.log(`Points updated: ${prev} -> ${newPoints}`);
                            return newPoints;
                        })
                        setShowPointsBadge(true)
                        setTimeout(() => setShowPointsBadge(false), 3000)

                        // Notify other components (like PointsBar) that points were updated
                        window.dispatchEvent(new CustomEvent('userPointsUpdated', {
                            detail: {
                                points: data.pointsEarned,
                                streamerId: props.stream.user.id,
                                source: 'chat'
                            }
                        }));

                        // TODO: Backend is not persisting message points correctly
                        // Once backend is fixed, uncomment this to sync with DB:
                        /*
                        try {
                            const { getUserPoints } = await import('../../services/points.service');
                            const pointsData = await getUserPoints();
                            const streamerId = String(props.stream.user.id);
                            const streamerPoints = pointsData.byStreamer.find(
                                p => String(p.streamerId) === streamerId
                            );
                            const actualPoints = streamerPoints ? streamerPoints.points : 0;
                            setCurrentPoints(actualPoints);
                        } catch (error) {
                            console.error("Error fetching updated points:", error);
                        }
                        */
                    }
                    doChattingRef.current(newMessage, props.stream)
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

    // Listen for local points updates (from gifts)
    useEffect(() => {
        const handlePointsUpdate = (event: any) => {
            const { points, streamerId, source } = event.detail;
            // Only update if it's for this streamer AND it's NOT from chat (to avoid double counting)
            if (String(streamerId) === String(props.stream.user.id) && source !== 'chat') {
                console.log(`Received local points update (from ${source || 'unknown'}): +${points} pts`);
                setCurrentPoints(prev => prev + points);
                setPointsEarned(points);
                setShowPointsBadge(true);
                setTimeout(() => setShowPointsBadge(false), 3000);
            }
        };

        window.addEventListener('userPointsUpdated', handlePointsUpdate);
        return () => {
            window.removeEventListener('userPointsUpdated', handlePointsUpdate);
        };
    }, [props.stream.user.id]);

    return (
        <div className="RightSide">
            <LevelUpModal
                isOpen={showLevelUpModal}
                onClose={() => setShowLevelUpModal(false)}
                levelName={newLevelData?.name || ''}
                levelNumber={newLevelData?.number || 1}
            />
            <div className="ChatTitle">
                {user ?
                    <ProgressBar
                        actual={progress.current}
                        max={progress.max}
                        topic={progress.topic}
                    />
                    : ""}
                {showPointsBadge && pointsEarned > 0 && (
                    <div className="badge bg-success ms-2 fade-in">
                        +{pointsEarned} puntos
                    </div>
                )}
            </div>
            <div className="RightSideScroll">
                {
                    messages.map((mensaje: Message, index: number) => {
                        return (
                            <ChatMessage key={`msg-${index}`} mensaje={mensaje} loyaltyLevels={loyaltyLevels} />
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