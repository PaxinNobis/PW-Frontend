import { useNavigate } from "react-router-dom";
import "./TyC.css"
import "../../GlobalObjects/Global.css"

const secciones: Seccion[] = [

	{
		id: "1",
		titulo: "Aceptación de Términos",
	},
	{
		id: "2",
		titulo: "Uso de la Plataforma",
	},
	{
		id: "3",
		titulo: "Contenido del Usuario",
	},
	{
		id: "4",
		titulo: "Propiedad Intelectual",
	},
	{
		id: "5",
		titulo: "Limitación de Responsabilidad",
	},
	{
		id: "6",
		titulo: "Modificaciones",
	},
	{
		id: "7",
		titulo: "Terminación",
	},
	{
		id: "8",
		titulo: " Contacto",
	}

]

const TyC = () => {
	const navigate = useNavigate();
	return <div>
		<div className="container">
			<p className="fst-italic mt-5">Ultima actualización: Octubre de 2025</p>
			<h1 className="fw-bold">Términos y Condiciones</h1>
			<hr className="w-30 mx-auto border-2 mb-5" />

			<div>

				<div className="row">
					<div className="col-md-4">
						<div className="sticky-sm-top margins">
							<ol className="list-group-numbered">
								{secciones.map((sec) =>
									<li key={sec.id} className="list-group-item"><a href={`#${sec.id}`}>{sec.titulo}</a></li>
								)}
							</ol>
						</div>
					</div>

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

							{/* Imagen ilustrativa */}
							<div className="text-center my-4">
								<img
									src={`${import.meta.env.BASE_URL}assets/img_tyc.png`}
									alt="Términos y Condiciones"
									className="img-fluid rounded shadow"
									style={{ maxWidth: '600px' }}
								/>
							</div>



							<h2 className="h4 mb-3" id="1">1. Aceptación de los Términos</h2>
							<p>
								Al acceder y utilizar AstroTV, usted acepta estar sujeto a estos
								términos y condiciones de uso. Si no está de acuerdo con alguna parte
								de estos términos, no debe utilizar nuestros servicios.
							</p>
							<hr className="w-30 mx-auto border-2" />

							<h2 className="h4 mb-3" id="2">2. Uso de la Plataforma</h2>
							<p>
								AstroTV es una plataforma de streaming en vivo que permite a los
								usuarios transmitir y ver contenido en tiempo real. Los usuarios deben:
							</p>
							<ul>
								<li>Ser mayores de 13 años o tener el consentimiento de un tutor legal</li>
								<li>Proporcionar información precisa y actualizada durante el registro</li>
								<li>Mantener la confidencialidad de su cuenta y contraseña</li>
								<li>No compartir contenido que infrinja derechos de autor o sea ilegal</li>
								<li>Respetar a otros usuarios y mantener un ambiente positivo</li>
							</ul>
							<hr className="w-30 mx-auto border-2" />


							<h2 className="h4 mb-3" id="3">3. Contenido del Usuario</h2>
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
								AstroTV se reserva el derecho de eliminar contenido que viole
								estos términos sin previo aviso.
							</p>
							<hr className="w-30 mx-auto border-2" />

							<h2 className="h4 mb-3" id="4">4. Propiedad Intelectual</h2>
							<p>
								Todo el contenido, marcas, logotipos y material de AstroTV están
								protegidos por derechos de autor y otras leyes de propiedad intelectual.
								No se permite el uso no autorizado de ningún material de la plataforma.
							</p>
							<hr className="w-30 mx-auto border-2" />


							<h2 className="h4 mb-3" id="5">5. Limitación de Responsabilidad</h2>
							<p>
								AstroTV no se hace responsable por:
							</p>
							<ul>
								<li>Interrupciones del servicio o errores técnicos</li>
								<li>Contenido generado por usuarios</li>
								<li>Pérdida de datos o información</li>
								<li>Daños indirectos o consecuentes del uso de la plataforma</li>
							</ul>
							<hr className="w-30 mx-auto border-2" />

							<h2 className="h4 mb-3" id="6">6. Modificaciones</h2>
							<p>
								AstroTV se reserva el derecho de modificar estos términos en
								cualquier momento. Los cambios entrarán en vigor inmediatamente después
								de su publicación. Es responsabilidad del usuario revisar periódicamente
								estos términos.
							</p>
							<hr className="w-30 mx-auto border-2" />

							<h2 className="h4 mb-3" id="7">7. Terminación</h2>
							<p>
								AstroTV puede suspender o terminar su acceso a la plataforma
								en cualquier momento, con o sin causa, con o sin previo aviso. Las
								disposiciones de estos términos que por su naturaleza deban sobrevivir
								a la terminación, sobrevivirán.
							</p>
							<hr className="w-30 mx-auto border-2" />


							<h2 className="h4 mb-3" id="8">8. Contacto</h2>
							<p>
								Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en:
							</p>
							<p className="mb-0">
								<strong>Email:</strong> support@AstroTV.com<br />
								<strong>Teléfono:</strong> +1 (555) 123-4567
							</p>

							{/* Botón regresar */}
							<div className="text-center mt-4">
								<button
									onClick={() => navigate('/')}
									className="btn btn-primary btn-lg page-button border-0"
								>
									Regresar
								</button>
							</div>

							{/* Disclaimer */}
							<div className="alert alert-info mt-4 text-card border-0">
								<p className="mb-0">
									<strong>Nota:</strong> Este es un documento simulado con fines demostrativos.
									En una aplicación real, estos términos serían redactados por un equipo legal.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default TyC

type Seccion = {
	id: string;
	titulo: string;
}