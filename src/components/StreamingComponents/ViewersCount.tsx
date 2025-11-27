import { useEffect } from 'react';
import { useViewers } from '../../hooks/useNewFeatures';

interface ViewersCountProps {
  streamId: string;
}

const ViewersCount = ({ streamId }: ViewersCountProps) => {
  const { viewerCount, viewers, loading, joinStream, leaveStream } = useViewers(streamId);

  // Join/Leave automático
  useEffect(() => {
    if (streamId) {
      joinStream();
    }

    return () => {
      if (streamId) {
        leaveStream();
      }
    };
  }, [streamId, joinStream, leaveStream]);

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <i className="bi bi-eye-fill me-2"></i>
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="viewers-section">
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-eye-fill me-2 text-primary"></i>
        <span className="fw-bold">{viewerCount} espectadores</span>
      </div>

      {/* Lista de viewers (primeros 10) */}
      {viewers.length > 0 && (
        <div className="viewers-list">
          <small className="text-muted">Viendo ahora:</small>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {viewers.slice(0, 10).map(viewer => (
              <div key={viewer.id} className="viewer-item d-flex align-items-center" title={viewer.name}>
                <img 
                  src={viewer.pfp} 
                  alt={viewer.name} 
                  width="24" 
                  height="24"
                  className="rounded-circle me-1"
                />
                <small>{viewer.name}</small>
              </div>
            ))}
            {viewers.length > 10 && (
              <small className="text-muted">+{viewers.length - 10} más</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewersCount;
