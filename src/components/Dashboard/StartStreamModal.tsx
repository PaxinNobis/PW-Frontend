import { useState } from 'react';
import type { User } from '../../GlobalObjects/Objects_DataTypes';
import type { Game } from '../../GlobalObjects/Objects_DataTypes';

interface StartStreamModalProps {
    show: boolean;
    onClose: () => void;
    doStreaming: (user: string, title: string, game: string, link: string) => Promise<void>;
    user: User | null;
    games: Game[];
}

import './StartStreamModal.css';

const StartStreamModal = ({ show, onClose, doStreaming, user, games }: StartStreamModalProps) => {
    const [title, setTitle] = useState<string>("");
    const [gameId, setGameId] = useState<string>("");
    const [iframeUrl, setIframeUrl] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    if (!show || !user) return null;

    const handleStartStream = async () => {
        setError("");

        if (!title.trim()) {
            setError("El título es obligatorio");
            return;
        }
        if (!gameId) {
            setError("Debes seleccionar un juego");
            return;
        }
        if (!iframeUrl.trim()) {
            setError("El link de VDO Ninja es obligatorio");
            return;
        }

        setLoading(true);
        try {
            await doStreaming(user.name, title.trim(), gameId, iframeUrl.trim());
            onClose();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al iniciar el stream. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block modal-backdrop-custom" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Iniciar Stream</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => { e.preventDefault(); handleStartStream(); }}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Título</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Introduce un título"
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Juego</label>
                                <select
                                    value={gameId}
                                    onChange={(e) => setGameId(e.target.value)}
                                    className="form-select"
                                    disabled={loading}
                                >
                                    <option value="">Selecciona un juego</option>
                                    {games.map((game: Game, index: number) => (
                                        <option value={game.id || game.name} key={game.id || index}>
                                            {game.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Link de VDO Ninja</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    value={iframeUrl}
                                    onChange={(e) => setIframeUrl(e.target.value)}
                                    placeholder="https://vdo.ninja/..."
                                    disabled={loading}
                                />
                                <small className="text-muted">
                                    Pega aquí el link del iframe de VDO Ninja
                                </small>
                            </div>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary fw-bold page-button border-0"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Iniciando...
                                        </>
                                    ) : (
                                        'Iniciar Stream'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartStreamModal;
