import { useState, useEffect } from 'react';
import { usePoints } from '../../hooks/useNewFeatures';
import { getStreamerGifts } from '../../services/streamer.service';
import type { CustomGift } from '../../types/api';
import "./PointsBar.css";
import "../../GlobalObjects/Icons.css";

interface PointsBarProps {
    streamerId: string;
}

const PointsBar = ({ streamerId }: PointsBarProps) => {
    const { points, loading } = usePoints();
    const [gifts, setGifts] = useState<CustomGift[]>([]);
    const [loadingGifts, setLoadingGifts] = useState(false);

    // Encontrar puntos del streamer actual
    const streamerPoints = points?.byStreamer.find(
        s => s.streamerId === streamerId
    );

    const totalPoints = streamerPoints?.points || 0;

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
                                <button className="dropdown-item d-flex justify-content-between align-items-center py-2" type="button">
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
        </div>
    );
};

export default PointsBar;