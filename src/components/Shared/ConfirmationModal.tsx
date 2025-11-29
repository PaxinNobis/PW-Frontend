import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'danger' | 'success';
    showCancel?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmColor = 'primary',
    showCancel = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal-content">
                <div className="confirmation-modal-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="confirmation-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirmation-modal-footer">
                    {showCancel && (
                        <button className="btn-cancel" onClick={onClose}>
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`btn-confirm btn-${confirmColor}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
