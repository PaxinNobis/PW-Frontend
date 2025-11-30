

interface PanelHeaderProps {
  isLive?: boolean;
  onToggleStream?: () => void;
}

const PanelHeader = function ({ isLive = false, onToggleStream }: PanelHeaderProps) {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <h1 className="h4">Panel de creador</h1>
      <div>
        <button
          className={`btn ${isLive ? 'btn-danger' : 'btn-success'} me-2`}
          onClick={onToggleStream}
        >
          {isLive ? 'Detener Stream' : 'Iniciar Stream'}
        </button>
        <button className="btn btn-secondary">Configuración</button>
      </div>
    </div>
  );
};

export default PanelHeader;
