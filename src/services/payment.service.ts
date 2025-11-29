// Servicio de pagos - Conectado al backend

import type {
  CoinPack,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  TransactionHistoryResponse,
  BalanceResponse,
} from '../types/api';
import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost } from '../utils/api.utils';

/**
 * Obtener paquetes de monedas disponibles
 * Endpoint público - No requiere autenticación
 */
export const getCoinPacks = async (): Promise<CoinPack[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_COIN_PACKS}`;
  return apiGet<CoinPack[]>(url, API_CONFIG.HEADERS);
};

/**
 * Crear sesión de pago con Stripe
 */
export const createCheckoutSession = async (
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_CHECKOUT}`;
  return apiPost<CheckoutSessionResponse>(url, data, getAuthHeaders());
};

/**
 * Obtener historial de transacciones
 */
export const getTransactionHistory = async (page = 1, limit = 10): Promise<TransactionHistoryResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_HISTORY}?page=${page}&limit=${limit}`;
  return apiGet<TransactionHistoryResponse>(url, getAuthHeaders());
};

/**
 * Obtener balance actual de monedas
 */
export const getBalance = async (): Promise<BalanceResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_BALANCE}`;
  return apiGet<BalanceResponse>(url, getAuthHeaders());
};
