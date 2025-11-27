// pages/Login.tsx
// Página de inicio de sesión
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"
interface SigninProps {
	doSignIn : (name : string, email : string, pass: string) => Promise<number>
}
const Login = (props: SigninProps) => {

    const navigate = useNavigate()
    const [name, SetName] = useState<string>("");
	const [email, SetEmail] = useState<string>("");
	const [pass, SetPass] = useState<string>("");
	const [error, SetError] = useState<string>("");

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetName(e.currentTarget.value)
    }
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetEmail(e.currentTarget.value)
    }
	const onPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetPass(e.currentTarget.value)
    }

    const handleSigin = async () => {
        SetError("");
        try {
            await props.doSignIn(name, email, pass);
            navigate("/Home");
            window.location.reload();
        } catch (err) {
            if (err instanceof Error) {
                SetError(err.message);
            } else {
                SetError("Error desconocido durante el registro");
            }
        }
    }
	return (
		<div className="container-fluid">
		<div className="row justify-content-center mt-5">
			<div className="col-12 col-md-6 col-lg-4">
			<div className="card">
				<div className="card-body p-4">
				<h2 className="card-title text-center mb-4">Crear Cuenta</h2>

				<form>
                    <div className="mb-3">
						<label className="form-label fw-semibold">Nombre</label>
						<input className="form-control" type="text" value={name} onChange={onNameChange} placeholder="tunombre"/>
					</div>
					<div className="mb-3">
						<label className="form-label fw-semibold">Email</label>
						<input className="form-control" type="text" value={email} onChange={onEmailChange} placeholder="tu@email.com"/>
					</div>
					<div className="mb-3">
						<label className="form-label fw-semibold">Contraseña</label>
						<input className="form-control" type="password" value={pass} onChange={onPassChange} placeholder="••••••••" />
					</div>	
                    {error? 
					<div className="account-errors">
						{error}
                    </div> 
					: 
					""
					}
					<button type="button" className="btn btn-primary w-100 fw-bold page-button border-0" onClick={handleSigin}>
						Registrarse aquí
					</button>
				</form>
                
				<div className="text-center mt-3">
					<p className="mb-0">
					¿Ya tienes cuenta?{' '}
					<Link to="/login" className="text-decoration-none">
						Inicia sesión aquí
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
