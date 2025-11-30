// pages/Terms.tsx
// RF008 - Página de Términos y Condiciones

import { useNavigate } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {/* Req 08 */}
          <div className="text-center mb-4">
            <img
              src="https://placehold.co/800x300/6441a5/ffffff?text=Términos+y+Condiciones"
              alt="Términos y Condiciones"
              className="img-fluid rounded mb-3 terms-header-image"
            />
            <h1 className="display-4 fw-bold">Términos y Condiciones</h1>
            <p className="text-muted">Última actualización: 12 de octubre de 2025</p>
          </div>

          {/* RF008 - Contenido de políticas (placeholder simulado) */}
          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar StreamPlatform, usted acepta estar sujeto a estos
                términos y condiciones de uso. Si no está de acuerdo con alguna parte
                de estos términos, no debe utilizar nuestros servicios.
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">2. Uso de la Plataforma</h2>
              <p>
                StreamPlatform es una plataforma de streaming en vivo que permite a los
                usuarios transmitir y ver contenido en tiempo real. Los usuarios deben:
              </p>
              <ul>
                <li>Ser mayores de 13 años o tener el consentimiento de un tutor legal</li>
                <li>Proporcionar información precisa y actualizada durante el registro</li>
                <li>Mantener la confidencialidad de su cuenta y contraseña</li>
                <li>No compartir contenido que infrinja derechos de autor o sea ilegal</li>
                <li>Respetar a otros usuarios y mantener un ambiente positivo</li>
              </ul>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">3. Contenido del Usuario</h2>
              <p>
                Los usuarios son responsables del contenido que transmiten o publican
                en la plataforma. Al subir contenido, usted garantiza que:
              </p>
              <ul>
                <li>Posee los derechos necesarios sobre el contenido</li>
                <li>El contenido no viola ninguna ley o regulación</li>
                <li>El contenido no infringe los derechos de terceros</li>
              </ul>
              <p>
                StreamPlatform se reserva el derecho de eliminar contenido que viole
                estos términos sin previo aviso.
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">4. Propiedad Intelectual</h2>
              <p>
                Todo el contenido, marcas, logotipos y material de StreamPlatform están
                protegidos por derechos de autor y otras leyes de propiedad intelectual.
                No se permite el uso no autorizado de ningún material de la plataforma.
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">5. Limitación de Responsabilidad</h2>
              <p>
                StreamPlatform no se hace responsable por:
              </p>
              <ul>
                <li>Interrupciones del servicio o errores técnicos</li>
                <li>Contenido generado por usuarios</li>
                <li>Pérdida de datos o información</li>
                <li>Daños indirectos o consecuentes del uso de la plataforma</li>
              </ul>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">6. Modificaciones</h2>
              <p>
                StreamPlatform se reserva el derecho de modificar estos términos en
                cualquier momento. Los cambios entrarán en vigor inmediatamente después
                de su publicación. Es responsabilidad del usuario revisar periódicamente
                estos términos.
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">7. Terminación</h2>
              <p>
                StreamPlatform puede suspender o terminar su acceso a la plataforma
                en cualquier momento, con o sin causa, con o sin previo aviso. Las
                disposiciones de estos términos que por su naturaleza deban sobrevivir
                a la terminación, sobrevivirán.
              </p>
            </div>
          </div>

          <div className="card mb-4 bg-light">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">8. Contacto</h2>
              <p>
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en:
              </p>
              <p className="mb-0">
                <strong>Email:</strong> support@streamplatform.com<br />
                <strong>Teléfono:</strong> +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Botón regresar */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-lg"
            >
              Regresar
            </button>
          </div>

          {/* Disclaimer */}
          <div className="alert alert-info mt-4">
            <p className="mb-0">
              <strong>Nota:</strong> Este es un documento simulado con fines demostrativos.
              En una aplicación real, estos términos serían redactados por un equipo legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
