import { useState, useEffect } from 'react';

interface PanelHeaderProps {
  isLive?: boolean;
  onToggleStream?: () => void;
  startedAt?: string;
}

const PanelHeader = function ({ isLive = false, onToggleStream, startedAt }: PanelHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  useEffect(() => {
    let interval: any;

    if (isLive && startedAt) {
      const startTime = new Date(startedAt).getTime();

      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = now - startTime;

        if (diff >= 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          const formattedTime = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':');

          setElapsedTime(formattedTime);
        }
      };

      updateTimer(); // Initial call
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedTime("00:00:00");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, startedAt]);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h1 className="h4">Panel de creador</h1>
      <div className="d-flex align-items-center gap-3">
        {isLive && (
          <div className="d-flex align-items-center bg-dark text-white px-3 py-2 rounded">
            <div className="spinner-grow text-danger spinner-grow-sm me-2" role="status">
              <span className="visually-hidden">Live</span>
            </div>
            <span className="fw-bold font-monospace fs-5">{elapsedTime}</span>
          </div>
        )}
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
