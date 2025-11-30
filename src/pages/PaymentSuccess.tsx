import { Link } from 'react-router-dom';
import './PaymentStatus.css';

const PaymentSuccess = () => {
  return (
    <div className="container text-center my-5">
      <i className="bi bi-check-circle text-success status-icon-large"></i>
      <h1 className="mt-4">¡Pago Exitoso!</h1>
      <p className="lead">Tu compra se ha procesado correctamente</p>

      <div className="card mx-auto mt-4 card-max-width-400">
        <div className="card-body">
          <h5 className="card-title">Gracias por tu compra</h5>
          <p className="card-text">Tus monedas han sido añadidas a tu cuenta.</p>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>

      <div className="alert alert-info mt-4 mx-auto alert-max-width-600">
        Si tienes algún problema, por favor contacta a soporte.
      </div>
    </div>
  );
};

export default PaymentSuccess;
