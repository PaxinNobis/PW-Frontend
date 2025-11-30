import './NotificacionNivel.css';

interface NotificacionNivelProps {
  levelName: string;
  onClose?: () => void;
}

const NotificacionNivel = ({ levelName, onClose }: NotificacionNivelProps) => {
  return (
    <div className="notificacion-container animate__animated animate__bounceIn">
      <h4 className="text-warning fw-bold">
        <i className="bi bi-stars me-2"></i>
        ¡Felicidades!
      </h4>
      <div className="notificacion-alert" role="alert">
        Has subido al nivel <strong className="text-primary">{levelName}</strong>
      </div>
      {onClose && (
        <button className="btn btn-sm btn-outline-light mt-2" onClick={onClose}>
          Entendido
        </button>
      )}
    </div>
  );
};

export default NotificacionNivel;
