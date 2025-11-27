import { usePoints } from '../../hooks/useNewFeatures';
import "./PointsBar.css";
import "../../GlobalObjects/Icons.css";

interface PointsBarProps {
    streamerId: string;
}

const PointsBar = ({ streamerId }: PointsBarProps) => {
    const { points, loading } = usePoints();
    
    // Encontrar puntos del streamer actual
    const streamerPoints = points?.byStreamer.find(
        s => s.streamerId === streamerId
    );

    const totalPoints = streamerPoints?.points || 0;

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
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="giftsDropdown">
                    <li>
                        <div className="dropdown-item-text fw-bold">
                            Regalos disponibles
                        </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <div className="dropdown-item-text small text-muted">
                            Próximamente...
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PointsBar;