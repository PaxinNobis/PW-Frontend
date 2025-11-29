import "./ChatMessage.css"
import type { Message } from "../../GlobalObjects/Objects_DataTypes"
import type { LoyaltyLevel } from "../../services/loyalty.service"

interface ChatMessageProps {
    mensaje: Message
    loyaltyLevels?: LoyaltyLevel[]
}

const ChatMessage = (props: ChatMessageProps) => {
    const getLevelName = () => {
        if (props.mensaje.levelName) return props.mensaje.levelName;

        const levelNum = props.mensaje.level || 1;
        if (!props.loyaltyLevels || props.loyaltyLevels.length === 0) return levelNum;

        // Try to find by ID
        const levelById = props.loyaltyLevels.find(l => l.id === levelNum);
        if (levelById) return levelById.nombre;

        // Fallback: try to map number to index (1-based)
        if (levelNum > 0 && levelNum <= props.loyaltyLevels.length) {
            return props.loyaltyLevels[levelNum - 1].nombre;
        }

        return levelNum;
    };

    return (
        <h6 className="ChatMessage">
            <span className="text-muted small me-2">{props.mensaje.hora}</span>
            <span className="badge bg-secondary rounded-pill me-1" style={{ fontSize: '0.7em' }}>
                {getLevelName()}
            </span>
            <span className="fw-bold">{props.mensaje.user.name}:</span> {props.mensaje.texto}
        </h6>
    )
}
export default ChatMessage