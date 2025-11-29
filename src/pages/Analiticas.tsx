import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/panel.service';
import type { Analytics } from '../types/api';

const Analiticas = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('No se pudieron cargar las analíticas.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-center p-5 text-white">Cargando analíticas...</div>;
    }

    if (error) {
        return <div className="alert alert-danger m-4">{error}</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="mb-4 text-white">Panel de Analíticas</h1>

            {/* Resumen Principal */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card h-100 bg-dark border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Horas Transmitidas</h5>
                            <h2 className="display-4 text-white">{analytics?.horasTransmitidas || '0:00'}</h2>
                            <p className="text-muted">Total acumulado</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card h-100 bg-dark border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title text-warning">Monedas Recibidas</h5>
                            <h2 className="display-4 text-white">{analytics?.monedasRecibidas || 0}</h2>
                            <p className="text-muted">Total acumulado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analiticas;
