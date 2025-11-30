import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Reemplaza con tu clave pública de Stripe (de prueba)
// Esta clave es segura para exponer en el frontend
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface StripeEmbeddedCheckoutProps {
    clientSecret: string;
    onComplete?: () => void;
}

const StripeEmbeddedCheckout = ({ clientSecret, onComplete }: StripeEmbeddedCheckoutProps) => {
    const options = {
        clientSecret,
        onComplete,
    };

    return (
        <div id="checkout" className="my-4">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};

export default StripeEmbeddedCheckout;
