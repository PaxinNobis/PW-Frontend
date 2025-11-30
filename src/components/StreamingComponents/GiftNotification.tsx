import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Confetti from 'react-confetti-boom';
import './GiftNotification.css';

interface GiftNotificationProps {
    senderName: string;
    giftName: string;
    onClose: () => void;
    actionText?: string;
    iconClass?: string;
}

const GiftNotification = ({ senderName, giftName, onClose, actionText = "te ha enviado", iconClass = "bi-gift-fill" }: GiftNotificationProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            // Wait for exit animation to finish before calling onClose
            setTimeout(onClose, 500);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return createPortal(
        <>
            {visible && (
                <div className="confetti-container">
                    <Confetti mode="boom" particleCount={200} shapeSize={15} />
                </div>
            )}
            <div className={`gift-notification-container ${visible ? 'visible' : ''}`}>
                <div className="gift-notification-content">
                    <div className="gift-icon-wrapper">
                        <i className={`bi ${iconClass} gift-icon-large`}></i>
                    </div>
                    <div className="gift-details">
                        <div className="gift-sender">{senderName}</div>
                        <div className="gift-message">
                            {actionText} <span className="gift-name-highlight">{giftName}</span>
                        </div>
                    </div>
                    <div className="gift-sparkles"></div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default GiftNotification;
