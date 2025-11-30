// components/NavBar/UserIcon.tsx
// Icono de usuario con menú desplegable integrado

import { Link } from 'react-router-dom';
import type { User } from "../../GlobalObjects/Objects_DataTypes";
import { useNavigate } from 'react-router-dom';
import "../../GlobalObjects/Icons.css";
import "./UserIcon.css"

interface UserIconProps {
  user: User | null;
  doLogOut: () => void;
}

const UserIcon = (props: UserIconProps) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    try {
      props.doLogOut()
      navigate("/Home")
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message)
      }
      else {
        console.log("Error desconocido durante el login");
      }
    }
  }
  return (
    <div className="dropdown">
      <button className="carousel-button d-flex justify-content-center align-items-center border-0 ms-3" type="button" id="userDropdown" data-bs-toggle="dropdown"
        aria-expanded="false">
        <img className="PfP" src={props.user?.pfp} alt="Img" />
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <li>
          <div className="dropdown-item-text fw-bold m">
            <img className="pfpdropdown" src={props.user?.pfp} alt="Img" /> {props.user?.name}
          </div>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to={`/profile/${props.user?.name || props.user?.id || 'me'}`} className="dropdown-item">
            <i className="bi bi-person-circle me-2"></i>
            Ver Perfil
          </Link>
        </li>
        <li>
          <Link to="/panelcreador" className="dropdown-item">
            <i className="bi bi-speedometer2 me-2"></i>
            Panel de Creador
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        {/* Opción: Cerrar Sesión */}
        <li>
          <button
            onClick={handleLogout}
            className="dropdown-item text-danger"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserIcon;
