import "./SeccionCentral.css"
import { NavLink } from 'react-router-dom';

const SeccionCentral = (props: SeccionCentralProps) => {
  return <div>

    <div className="row">
      {/* Columna izquierda - sticky */}
      <div className="col-md-4 mt-1">
        <div className="sticky-sm-top">

          <ol className="list-group-numbered">
            {props.sec.map((sec) =>
              <li className="list-group-item"><a href={`#${sec.id}`}>{sec.titulo}</a></li>
            )}
          </ol>
          <div className="col-6 mx-auto">
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to="/"
            >
              <div className="btn btn-dark">
                Regresar
              </div>
            </NavLink>
          </div>
        </div>


      </div>


      {/* Columna derecha - scrollable */}
      <div className="col-md-7 mt-1">

        <div className="secciones mb-4 text-justify">
          <h3 className="fw-bold">Términos de Servicio</h3>
          <p>Bienvenido a nuestra plataforma de streaming. Al usar nuestros servicios de AstroTV,
            ustede acepta cumplir con esto Términos y Condiciones que rigen su acceso y uso de la Plataforma, sitio web,
            aplicaciones, contenido multimedia y servicios.
          </p>
          <p>Nuestros Servicios están diseñados para ofrecer entretenimiento digital seguro y accesible.
            Al utilizar la Plataforma, usted reconoce que ha leído y acepta los Términos, los cuales constituyen un acuerdo legalmente vinculante
            entre usted y AstroTV.
          </p>
          <p>Le recomendamos revisarlos con atención para comprender sus derechos y responsabilidades.</p>
          <img src={`${import.meta.env.BASE_URL}assets/img_tyc.png`} alt="Términos" className="img-fluid rounded mb-5" />

          {props.sec.map((sec) =>
            <div id={sec.id} className="mb-4">
              <h5>{sec.titulo}</h5>
              <p>{sec.contenido}</p>
              <hr className="w-30 mx-auto border-2" />
            </div>

          )}
        </div>



      </div>

    </div>


  </div>

}

export default SeccionCentral

export type Seccion = {
  id: string;
  titulo: string;
  contenido: string;
}

interface SeccionCentralProps {
  sec: Seccion[]
}

