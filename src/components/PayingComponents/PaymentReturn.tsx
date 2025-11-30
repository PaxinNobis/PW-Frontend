import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PaymentReturn = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const navigate = useNavigate();

    const { refreshUser } = useAuth();

    const processingRef = useRef(false);

    const handleManualRefresh = () => {
        if (refreshUser) refreshUser();
        window.dispatchEvent(new CustomEvent('userCoinsUpdated'));
    };

    useEffect(() => {
        const verifyAndRefresh = async () => {
            if (sessionId && !processingRef.current) {
                processingRef.current = true; // Marcar como procesando para evitar dobles llamadas
                try {
                    // 1. Verificar la sesión con el backend manualmente
                    console.log("Verificando pago con backend...");
                    const { verifyPaymentSession } = await import('../../services/payment.service');
                    await verifyPaymentSession(sessionId);
                    console.log("Pago verificado exitosamente");
                } catch (error) {
                    console.error("Error al verificar el pago (puede que ya se haya procesado):", error);
                } finally {
                    setStatus('success');

                    // 2. Actualizar datos del usuario inmediatamente
                    if (refreshUser) refreshUser();
                    window.dispatchEvent(new CustomEvent('userCoinsUpdated'));

                    // 3. Reintentar a los 3 segundos por seguridad (race conditions)
                    setTimeout(() => {

                        if (refreshUser) refreshUser();
                        window.dispatchEvent(new CustomEvent('userCoinsUpdated'));
                    }, 3000);
                }
            }
        };

        verifyAndRefresh();
    }, [sessionId, refreshUser]);

    if (status === 'success') {
        return (
            <div className="container mt-5 text-center">
                <div className="card border-0 shadow-sm p-5 bg-dark text-white">
                    <div className="mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="mb-3">¡Pago Exitoso!</h2>
                    <p className="lead mb-4">
                        Tus AstroCoins se han añadido a tu cuenta.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/payment')}
                        >
                            Volver a la Billetera
                        </button>
                        <button
                            className="btn btn-outline-light btn-lg"
                            onClick={handleManualRefresh}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Actualizar Saldo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default PaymentReturn;
