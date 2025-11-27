import { useState } from "react"
import PointsBar from "./PointsBar"
import { sendMessage, sendTyping } from "../../services/chat.service"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
import "./ChatBar.css"

interface ChatBarProps {
    GetUser : () => User | null
    stream : Stream
    streamerId: string
    onLocalMessage?: (message: { texto: string; hora: string; user: User }) => void
}

const ChatBar = (props : ChatBarProps) => {
    const [TextChat, SetTextChat] = useState<string>("")
    const [isTyping, setIsTyping] = useState(false)

    const TextChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        SetTextChat(e.currentTarget.value)
        
        // Indicar que está escribiendo
        if (!isTyping && e.currentTarget.value.length > 0) {
            setIsTyping(true)
            sendTyping(true)
        } else if (isTyping && e.currentTarget.value.length === 0) {
            setIsTyping(false)
            sendTyping(false)
        }
    }
    
    const user = props.GetUser();
    
    const handleChat = () => {
        if (!user || !TextChat.trim()) {
            return
        }
        
        // Crear hora actual
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const horafinal = `${horas}:${minutos}`;
        
        // Enviar mensaje por WebSocket
        const sentOverSocket = sendMessage(TextChat)
        
        // Fallback: Agregar mensaje localmente solo si el WebSocket no pudo enviar
        if (!sentOverSocket && props.onLocalMessage) {
            props.onLocalMessage({
                texto: TextChat,
                hora: horafinal,
                user: user
            })
        }
        
        // Limpiar input
        SetTextChat("")
        setIsTyping(false)
        sendTyping(false)
    }
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleChat()
        }
    }
    return(
        <div>
            <div className="ChatBar">
                <input 
                    className="ChatInput" 
                    value={TextChat} 
                    onChange={TextChange}
                    onKeyPress={handleKeyPress}
                    type="text" 
                    placeholder={user ? "Send a message" : "Inicia sesión para enviar mensajes!"} 
                    disabled={!user}
                />
            </div>
            <div className="d-flex justify-content-between">
                <PointsBar streamerId={props.streamerId} />
                <button className="ChatButton" onClick={handleChat} disabled={!user || TextChat === ""}>Enviar</button>
            </div>
        </div>
    )
}
export default ChatBar;