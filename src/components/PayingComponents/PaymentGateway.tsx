import { useLocation } from "react-router-dom";
import { useState } from "react";
import type { Pack } from "../../GlobalObjects/Objects_DataTypes";
import type { User } from "../../GlobalObjects/Objects_DataTypes";
import "./PaymentGateway.css"

interface PaymentGatewayProps {
	doPayment: (user : User | null, packId : string) => Promise<void>
	GetUser : () => User | null
}
const PaymentGateway = (props : PaymentGatewayProps) => {
	const location = useLocation();
	const { pack } = (location.state || {}) as { pack?: Pack };
	const [value, setValue] = useState<number>(0);
	const [price, setPrice] = useState<number>(0);
	const onStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const numericValue = parseInt(e.target.value) || 0;
			const limitedValue = Math.min(numericValue, 9999);
			setValue(limitedValue);
			setPrice(limitedValue * 5 / 100)
		}
	return (
		<div className="alert alert-info mt-4 text-card border-0">
			<h1>Completar compra</h1>
			<div className="d-flex justify-content-between align-items-center mt-4">
				<div className="text-start">
					{pack?
					<div>
						<h5 className="fw-bold">{pack.name}</h5> 
						<h5 className="fw-bold my-0"> {pack.value} Stars</h5>
					</div>
					: 
					<div className="d-flex justify-content-between align-items-center mt-4">
						<input inputMode="numeric" className="form-control numberInput text-center border-0" value={value} onChange={onStarsChange}/> 
						<h5 className="fw-bold mx-3 my-0">Stars</h5>
					</div>
					}
				</div>
				<div className="text-end">
					<h5 className="fw-bold mx-3 my-0">PEN {pack? pack.finalprice : price }</h5>
				</div>
			</div>
			<hr className="w-30 mx-auto border-2"/> 

			<div className="border  px-3 py-2">
				
				<div className="row">

				<div className="text-start mt-3 col-6">
				<h5 className="fw-bold">Pagar con Tarjeta</h5>
				<h6>Información de facturación</h6>
				
				
			</div>
			<div className="col-6 mt-3 text-end">
				<img src="https://content.app-sources.com/s/80905201177183951/uploads/Images/credit-card-logos-2213231.png?format=webp" className="img_pago mb-3" alt="tarjetas" />
			</div>
				</div>

			<form className="row g-3 text-start mb-3">
				<div className="col-md-6">
				<label className="form-label">Nombre</label>
				<input type="text" className="form-control" id="inputNombre"/>
				</div>
				<div className="col-md-6">
				<label className="form-label">Apellido</label>
				<input type="text" className="form-control" id="inputApellido"/>
				</div>
				<div className="col-12">
				<label className="form-label">Numero de tarjeta</label>
				<input type="text" className="form-control" id="inputTarjeta" placeholder="XXXX-XXXX XXXX-XXXX"/>
				</div>
				<div className="col-12">
				<label  className="form-label">CVV</label>
				<input type="text" className="form-control" id="inputCVV" placeholder="123"/>
				</div>
			</form>
			</div>
			<div className="modal-footer mt-3">
				<button 
					type="button" 
					className="btn btn-primary page-button" 
					onClick={async () => {
						if (pack && pack.id) {
							await props.doPayment(props.GetUser(), pack.id.toString());
						} else {
							alert("Por favor selecciona un paquete de monedas");
						}
					}}
				>
					Realizar Pago con Stripe
				</button>
			</div>
			</div>
		)
};

export default PaymentGateway;