import { useState, useEffect } from 'react';
import { usePoints } from '../../hooks/useNewFeatures';
import { getStreamerGifts } from '../../services/streamer.service';
import { sendGift } from '../../services/panel.service';
import type { CustomGift } from '../../types/api';
import ConfirmationModal from '../Shared/ConfirmationModal';
import "./PointsBar.css";
import "../../GlobalObjects/Icons.css";

interface PointsBarProps {
    streamerId: string;
}

const PointsBar = ({ streamerId }: PointsBarProps) => {
    const { points, loading, reload } = usePoints();
    const [gifts, setGifts] = useState<CustomGift[]>([]);
    const [loadingGifts, setLoadingGifts] = useState(false);
    const [sendingGift, setSendingGift] = useState<string | null>(null);

    // Modal State for Confirmation
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState<CustomGift | null>(null);

    // Modal State for Alerts (Success/Error)
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'danger';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Encontrar puntos del streamer actual
    const streamerPoints = points?.byStreamer.find(
        s => String(s.streamerId) === String(streamerId)
    );

    const totalPoints = streamerPoints?.points || 0;

    // Listen for points updates from messages or other sources
    useEffect(() => {
        const handlePointsUpdate = (event: any) => {
            const { streamerId: eventStreamerId } = event.detail;
            if (String(eventStreamerId) === String(streamerId)) {
                console.log("PointsBar: Points updated, reloading...");
                reload();
            }
        };

        window.addEventListener('userPointsUpdated', handlePointsUpdate);
        return () => {
            window.removeEventListener('userPointsUpdated', handlePointsUpdate);
        };
    }, [streamerId, reload]);

    useEffect(() => {
        const fetchGifts = async () => {
            if (!streamerId) return;
            setLoadingGifts(true);
            try {
                const response = await getStreamerGifts(streamerId);
                if (response.success) {
                    setGifts(response.gifts);
                }
            } catch (error) {
                console.error("Error fetching gifts:", error);
            } finally {
                setLoadingGifts(false);
            }
        };

        fetchGifts();
    }, [streamerId]);

    const handleGiftClick = (gift: CustomGift) => {
        setSelectedGift(gift);
        setIsConfirmOpen(true);
    };

    const showAlert = (title: string, message: string, type: 'success' | 'danger') => {
        setAlertConfig({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const confirmSendGift = async () => {
        if (!selectedGift || sendingGift) return;

        setSendingGift(selectedGift.id);
        try {
            const response = await sendGift(selectedGift.id, streamerId);
            if (response.success) {
                showAlert('¡Regalo enviado!', `Has enviado ${selectedGift.nombre} y ganado ${response.pointsEarned} puntos.`, 'success');
                reload(); // Actualizar puntos del usuario

                // Disparar evento para actualizar monedas en el Navbar (con actualización optimista)
                window.dispatchEvent(new CustomEvent('userCoinsUpdated', {
                    detail: { cost: selectedGift.costo }
                }));

                // Disparar evento para actualizar puntos en ChatSection y StreamingSection
                window.dispatchEvent(new CustomEvent('userPointsUpdated', {
                    detail: {
                        points: response.pointsEarned,
                        streamerId: streamerId,
                        source: 'gift'
                    }
                }));
            }
        } catch (error: any) {
            console.error("Error sending gift:", error);

            // Prioritize backend error message if available
            let errorMessage = error.data?.error || error.data?.message || error.message || "Error al enviar el regalo";

            // Simplificar mensaje de saldo insuficiente
            if (errorMessage.includes("Saldo insuficiente")) {
                errorMessage = "Saldo insuficiente";
            }

            showAlert('Error', errorMessage, 'danger');
        } finally {
            setSendingGift(null);
            setSelectedGift(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center">
                <i className="bi bi-star-fill text-warning me-2"></i>
                <span>...</span>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center">
            <div className="me-3">
                <i className="bi bi-star-fill text-warning me-2"></i>
                <span className="fw-bold">{totalPoints} pts</span>
            </div>
            <div className="dropup">
                <button className="support-button d-flex justify-content-center align-items-center border-0" type="button" id="giftsDropdown" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="bi bi-gift-fill ministars"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="giftsDropdown" style={{ minWidth: '250px' }}>
                    <li>
                        <div className="dropdown-header fw-bold text-dark">
                            Regalos disponibles
                        </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    {loadingGifts ? (
                        <li><div className="dropdown-item-text text-muted">Cargando regalos...</div></li>
                    ) : gifts.length > 0 ? (
                        gifts.map(gift => (
                            <li key={gift.id}>
                                <button
                                    className="dropdown-item d-flex justify-content-between align-items-center py-2"
                                    type="button"
                                    onClick={() => handleGiftClick(gift)}
                                    disabled={!!sendingGift}
                                >
                                    <span>{gift.nombre}</span>
                                    <div className="d-flex flex-column align-items-end ms-2">
                                        <span className="badge bg-warning text-dark rounded-pill mb-1">
                                            {gift.costo} <i className="bi bi-star-fill small"></i>
                                        </span>
                                        <span className="badge bg-info text-dark rounded-pill">
                                            +{gift.puntos} pts
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li><div className="dropdown-item-text text-muted small">Este streamer no tiene regalos configurados.</div></li>
                    )}
                </ul>
            </div>

            {/* Modal de Confirmación */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSendGift}
                title="Enviar Regalo"
                message={selectedGift ? `¿Quieres enviar ${selectedGift.nombre} por ${selectedGift.costo} monedas?` : ''}
                confirmText="Enviar"
                confirmColor="primary"
            />

            {/* Modal de Alerta (Éxito/Error) */}
            <ConfirmationModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText="Aceptar"
                confirmColor={alertConfig.type === 'danger' ? 'danger' : 'success'}
                showCancel={false}
            />
        </div>
    );
};

export default PointsBar;