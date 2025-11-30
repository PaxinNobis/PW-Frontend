import React from 'react';
import type { StreamerLevelResponse } from '../../services/streamer.service';
import './StreamerLevelProgress.css';

interface StreamerLevelProgressProps {
    levelData: StreamerLevelResponse | null;
    loading: boolean;
}

const StreamerLevelProgress: React.FC<StreamerLevelProgressProps> = ({ levelData, loading }) => {
    if (loading) {
        return (
            <div className="card mb-3 bg-dark text-white border-secondary">
                <div className="card-body">
                    <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-12 mt-2"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!levelData) {
        return null;
    }

    const { currentLevel, nextLevel, progress } = levelData;

    const getLevelName = (levelObj: any) => {
        if (!levelObj) return '';
        return levelObj.name || levelObj.level || levelObj.nombre || levelObj.title || levelObj.levelname || 'Desconocido';
    };

    // Calcular porcentaje de horas
    // Si no hay siguiente nivel, estamos al máximo (100%)
    const percentage = nextLevel
        ? Math.min(100, Math.max(0, (progress.currentHours / nextLevel.minHours) * 100))
        : 100;

    // Calcular horas restantes
    const hoursRemaining = nextLevel
        ? Math.max(0, nextLevel.minHours - progress.currentHours)
        : 0;

    return (
        <div className="rounded p-3 mb-3 streamer-level-container">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold streamer-level-title">
                    <i className="bi bi-trophy-fill me-2"></i>
                    {getLevelName(currentLevel)}
                </h5>
                {nextLevel && (
                    <small className="text-muted">
                        Siguiente: {getLevelName(nextLevel)}
                    </small>
                )}
            </div>

            <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1 text-white">
                    <span>Progreso de horas</span>
                    <span>{progress.currentHours.toFixed(2)} / {nextLevel ? nextLevel.minHours : 'MAX'} h</span>
                </div>
                <div className="progress streamer-level-progress-bg">
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated streamer-level-progress-bar"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></div>
                </div>
            </div>

            {nextLevel ? (
                <div className="d-flex align-items-center small mt-2 streamer-level-hours-remaining">
                    <i className="bi bi-clock-history me-2"></i>
                    <div>
                        <strong>{hoursRemaining.toFixed(2)} horas</strong> restantes para subir de nivel.
                    </div>
                </div>
            ) : (
                <div className="small mt-2 streamer-level-max">
                    <i className="bi bi-star-fill me-2"></i>
                    ¡Has alcanzado el nivel máximo!
                </div>
            )}
        </div>
    );
};

export default StreamerLevelProgress;
