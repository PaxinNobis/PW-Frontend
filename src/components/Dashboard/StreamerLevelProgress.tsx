import React from 'react';
import type { StreamerLevelResponse } from '../../services/streamer.service';

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
        <div className="rounded p-3 mb-3" style={{ backgroundColor: 'rgba(var(--nebula-violet), 0.3)', border: '1px solid rgba(var(--galactic-indigo), 0.5)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold" style={{ color: 'rgb(var(--supernova-yellow))' }}>
                    <i className="bi bi-trophy-fill me-2"></i>
                    {currentLevel.name}
                </h5>
                {nextLevel && (
                    <small className="text-muted">
                        Siguiente: {nextLevel.name}
                    </small>
                )}
            </div>

            <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1 text-white">
                    <span>Progreso de horas</span>
                    <span>{progress.currentHours.toFixed(1)} / {nextLevel ? nextLevel.minHours : 'MAX'} h</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: 'rgb(var(--stellar-blue))',
                            boxShadow: '0 0 10px rgba(var(--stellar-blue), 0.5)'
                        }}
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></div>
                </div>
            </div>

            {nextLevel ? (
                <div className="d-flex align-items-center small mt-2" style={{ color: 'rgb(var(--starlight-gray))' }}>
                    <i className="bi bi-clock-history me-2" style={{ color: 'rgb(var(--blue-dwarf))' }}></i>
                    <div>
                        <strong style={{ color: 'rgb(var(--blue-dwarf))' }}>{hoursRemaining.toFixed(1)} horas</strong> restantes para subir de nivel.
                    </div>
                </div>
            ) : (
                <div className="small mt-2" style={{ color: 'rgb(var(--supernova-yellow))' }}>
                    <i className="bi bi-star-fill me-2"></i>
                    ¡Has alcanzado el nivel máximo!
                </div>
            )}
        </div>
    );
};

export default StreamerLevelProgress;
