// pages/Login.tsx
// Página de inicio de sesión
import { useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

interface LoginProps {
	doLogIn : (email : string, pass: string) => Promise<number>
}
const Login = (props: LoginProps) => {

    const navigate = useNavigate()
	const [email, SetEmai] = useState<string>("");
	const [pass, SetPass] = useState<string>("");
	const [error, SetError] = useState<string>("");

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetEmai(e.currentTarget.value)
    }
	const onPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetPass(e.currentTarget.value)
    }

    const handleLogin = async () => {
        SetError("");
        try {
            await props.doLogIn(email, pass);
            navigate("/Home");
            window.location.reload();
        } catch (err) {
            if (err instanceof Error) {
                SetError(err.message);
            } else {
                SetError("Error desconocido durante el login");
            }
        }
    }
	return (
		<div className="container-fluid">
		<div className="row justify-content-center mt-5">
			<div className="col-12 col-md-6 col-lg-4">
			<div className="card">
				<div className="card-body p-4">
				<h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
				
				<div className="alert" role="alert">
					<strong>Cuentas de prueba:</strong>
					<ul className="mb-0 mt-2">
					<li><strong>Espectador:</strong> espectador@gmail.com / espectador123</li>
					<li><strong>Creador:</strong> creador@gmail.com / creador123</li>
					</ul>
				</div>

				<form>
					<div className="mb-3">
						<label className="form-label fw-semibold">Email</label>
						<input className="form-control" type="text" value={email} onChange={onNameChange} placeholder="tu@email.com"/>
					</div>
					<div className="mb-3">
						<label className="form-label fw-semibold">Contraseña</label>
						<input className="form-control" type="password" value={pass} onChange={onPassChange} placeholder="••••••••" />
					</div>	
					<button type="button" className="btn btn-primary w-100 fw-bold page-button border-0" onClick={handleLogin}>
						Iniciar Sesión
					</button>
					{error? 
					<div className="account-errors">
						{error}
                    </div> 
					: 
					""
					}
				</form>

				<div className="text-center mt-3">
					<p className="mb-0">
					¿No tienes cuenta?{' '}
					<Link to="/signin" className="text-decoration-none">
						Regístrate aquí
					</Link>
					</p>
				</div>
				</div>
			</div>
			</div>
		</div>
		</div>
	);
};

export default Login;
