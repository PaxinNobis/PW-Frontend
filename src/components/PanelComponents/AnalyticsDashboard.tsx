/**
 * Dashboard de Analíticas del Streamer
 * Usa el endpoint GET /api/panel/analytics
 */

import { useEffect, useState } from 'react';
import { getAnalytics } from '../../services/panel.service';

interface Analytics {
  id: string;
  horasTransmitidas: number;
  monedasRecibidas: number;
  streamerId: string;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
      console.log('Analíticas cargadas:', data);
    } catch (err: any) {
      console.error('Error al cargar analíticas:', err);
      setError(err.message || 'Error al cargar analíticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando analíticas...</span>
          </div>
          <p className="mt-2">Cargando tus estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al cargar analíticas
          </h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-danger" onClick={loadAnalytics}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container my-4">
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          No hay datos de analíticas disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-graph-up me-2"></i>
          Analíticas
        </h2>
        <button className="btn btn-outline-primary" onClick={loadAnalytics}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      <div className="row g-4">
        {/* Horas Transmitidas */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-clock-history fs-3 text-primary"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Horas Transmitidas</h6>
                  <h2 className="fw-bold mb-0">{analytics.horasTransmitidas}</h2>
                </div>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{ width: '100%' }}
                ></div>
              </div>
              <small className="text-muted">Total de horas en vivo</small>
            </div>
          </div>
        </div>

        {/* Monedas Recibidas */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-coin fs-3 text-success"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Monedas Recibidas</h6>
                  <h2 className="fw-bold mb-0">{analytics.monedasRecibidas}</h2>
                </div>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: '100%' }}
                ></div>
              </div>
              <small className="text-muted">Total de monedas ganadas</small>
            </div>
          </div>
        </div>

        {/* Promedio por Hora */}
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-calculator fs-3 text-info"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Promedio de Monedas por Hora</h6>
                  <h2 className="fw-bold mb-0">
                    {analytics.horasTransmitidas > 0 
                      ? (analytics.monedasRecibidas / analytics.horasTransmitidas).toFixed(2)
                      : '0.00'
                    }
                  </h2>
                </div>
              </div>
              <small className="text-muted">
                Monedas ganadas en promedio por cada hora de transmisión
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="alert alert-info mt-4" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Las estadísticas se actualizan en tiempo real desde el backend.
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
