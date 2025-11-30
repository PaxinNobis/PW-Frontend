import React from 'react';
import './LevelUpModal.css';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    levelName: string;
    levelNumber: number;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, levelName, levelNumber }) => {
    if (!isOpen) return null;

    return (
        <div className="level-up-modal-overlay">
            <div className="level-up-modal-content fade-in-up">
                <div className="level-up-header">
                    <i className="bi bi-stars text-warning display-4 mb-3"></i>
                    <h2 className="text-white fw-bold">¡Felicidades!</h2>
                </div>
                <div className="level-up-body">
                    <p className="text-light fs-5">Has subido al nivel</p>
                    <div className="level-badge-large my-4">
                        <span className="level-number">{levelNumber}</span>
                        <span className="level-name">{levelName}</span>
                    </div>
                    <p className="text-muted small">¡Sigue así para desbloquear más recompensas!</p>
                </div>
                <div className="level-up-footer mt-4">
                    <button className="btn btn-warning fw-bold px-4 rounded-pill" onClick={onClose}>
                        ¡Genial!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;
