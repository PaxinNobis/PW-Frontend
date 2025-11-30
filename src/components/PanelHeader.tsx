interface PanelHeaderProps {
  isLive?: boolean;
  onToggleStream?: () => void;
}

const PanelHeader = function ({ isLive = false, onToggleStream }: PanelHeaderProps) {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <h1 className="h4">Panel de creador</h1>
      <div>
        {isLive ? (
          <button
            className="btn btn-danger me-2"
            onClick={onToggleStream}
          >
            Detener Stream
          </button>
        ) : (
          <button
            className="btn btn-success me-2 page-button"
            onClick={onToggleStream}
          >
            Iniciar Stream
          </button>
        )}
      </div>
    </div>
  );
};

export default PanelHeader;
