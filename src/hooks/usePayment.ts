// Hooks para pagos

import { useApi, useMutation } from './useApi';
import { getCoinPacks, createCheckoutSession } from '../services/payment.service';
import type { CheckoutSessionRequest } from '../types/api';

/**
 * Hook para obtener paquetes de monedas
 */
export function useCoinPacks() {
  return useApi(() => getCoinPacks());
}

/**
 * Hook para crear sesión de checkout
 */
export function useCreateCheckout() {
  return useMutation((data: CheckoutSessionRequest) => createCheckoutSession(data));
}
