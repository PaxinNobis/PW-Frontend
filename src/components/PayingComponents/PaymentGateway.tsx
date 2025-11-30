import { useLocation } from "react-router-dom";
import { useState } from "react";
import type { Pack } from "../../GlobalObjects/Objects_DataTypes";
import type { User } from "../../GlobalObjects/Objects_DataTypes";
import "./PaymentGateway.css"
import StripeEmbeddedCheckout from "./StripeEmbeddedCheckout";
import { createCheckoutSession } from "../../services/payment.service";

interface PaymentGatewayProps {
	doPayment: (user: User | null, packId: string) => Promise<void>
	GetUser: () => User | null
}
const PaymentGateway = (_props: PaymentGatewayProps) => {
	const location = useLocation();
	const { pack } = (location.state || {}) as { pack?: Pack };
	const [value, setValue] = useState<number>(0);
	const [price, setPrice] = useState<number>(0);
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numericValue = parseInt(e.target.value) || 0;
		const limitedValue = Math.min(numericValue, 9999);
		setValue(limitedValue);
		setPrice(limitedValue * 5 / 100)
	}

	const handleInitiatePayment = async () => {
		if ((!pack || !pack.id) && value <= 0) {
			return;
		}

		try {
			setLoading(true);

			let paymentData: any = {};
			if (pack && pack.id) {
				paymentData = { coinPackId: pack.id };
			} else {
				// El backend calcula el precio basado en la cantidad (amount)
				paymentData = {
					amount: value
				};
			}

			const response = await createCheckoutSession(paymentData);

			if (response.clientSecret) {
				setClientSecret(response.clientSecret);
			} else if (response.url) {
				// Fallback a checkout hospedado si el backend devuelve URL
				window.location.href = response.url;
			} else {
				console.error('Error al iniciar el pago: Respuesta inválida del servidor');
			}
		} catch (error) {
			console.error('PaymentGateway: Error creating session:', error);
		} finally {
			setLoading(false);
		}
	};

	if (clientSecret) {
		return (
			<div className="container mt-4">
				<h2 className="mb-4">Finalizar Compra</h2>
				<StripeEmbeddedCheckout clientSecret={clientSecret} />
				<button
					className="btn btn-secondary mt-3"
					onClick={() => setClientSecret(null)}
				>
					Cancelar
				</button>
			</div>
		);
	}

	return (
		<div className="alert alert-info mt-4 text-card border-0">
			<h1>Completar compra</h1>
			<div className="d-flex justify-content-between align-items-center mt-4">
				<div className="text-start">
					{pack ?
						<div>
							<h5 className="fw-bold">{pack.name}</h5>
							<h5 className="fw-bold my-0"> {pack.value} AstroCoins</h5>
						</div>
						:
						<div className="d-flex justify-content-between align-items-center mt-4">
							<input inputMode="numeric" className="form-control numberInput text-center border-0" value={value} onChange={onStarsChange} />
							<h5 className="fw-bold mx-3 my-0">AstroCoins</h5>
						</div>
					}
				</div>
				<div className="text-end">
					<h5 className="fw-bold mx-3 my-0">PEN {pack ? pack.finalprice : price}</h5>
				</div>
			</div>
			<hr className="w-30 mx-auto border-2" />

			<div className="border  px-3 py-2">
				<div className="text-center p-4">
					<p>Haz clic en el botón de abajo para pagar de forma segura con Stripe.</p>
				</div>
			</div>
			<div className="modal-footer mt-3">
				<button
					type="button"
					className="btn btn-primary page-button"
					onClick={handleInitiatePayment}
					disabled={loading}
				>
					{loading ? 'Cargando...' : 'Pagar con Stripe'}
				</button>
			</div>
		</div>
	)
};

export default PaymentGateway;