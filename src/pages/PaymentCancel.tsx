import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="container text-center my-5">
      <i className="bi bi-x-circle text-danger" style={{ fontSize: '5rem' }}></i>
      <h1 className="mt-4">Pago Cancelado</h1>
      <p className="lead">No se realizó ningún cargo a tu cuenta</p>
      
      <div className="alert alert-info mx-auto mt-4" style={{ maxWidth: '600px' }}>
        <i className="bi bi-info-circle me-2"></i>
        El proceso de pago fue cancelado. Puedes intentarlo nuevamente cuando lo desees.
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-primary me-2">Volver al inicio</Link>
        <Link to="/coins" className="btn btn-outline-primary">Ver paquetes de monedas</Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
