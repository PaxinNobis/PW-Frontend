import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No se encontró información del pago');
        setLoading(false);
        return;
      }

      try {
        // El webhook ya procesó el pago, solo obtenemos el balance actualizado
        const response = await fetch('/api/payment/balance', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener balance');
        }

        const data = await response.json();
        setCoins(data.coins);
      } catch (err) {
        console.error('Error verificando pago:', err);
        setError('Error al verificar el pago. Por favor, contacta a soporte.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando pago...</span>
        </div>
        <p className="mt-3">Verificando tu pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '5rem' }}></i>
        <h1 className="mt-4">Hubo un problema</h1>
        <p className="lead">{error}</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container text-center my-5">
      <i className="bi bi-check-circle text-success" style={{ fontSize: '5rem' }}></i>
      <h1 className="mt-4">¡Pago Exitoso!</h1>
      <p className="lead">Tu compra se ha procesado correctamente</p>
      
      <div className="card mx-auto mt-4" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="card-title">Nuevo Saldo</h3>
          <div className="display-4 text-primary">
            <i className="bi bi-coin me-2"></i>
            {coins}
          </div>
          <p className="text-muted mt-2">monedas</p>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-primary me-2">Volver al inicio</Link>
        <Link to="/explore" className="btn btn-outline-primary">Explorar streams</Link>
      </div>

      <div className="alert alert-info mt-4 mx-auto" style={{ maxWidth: '600px' }}>
        <i className="bi bi-info-circle me-2"></i>
        Tus monedas ya están disponibles para usar en regalos y apoyar a tus streamers favoritos.
      </div>
    </div>
  );
};

export default PaymentSuccess;
