// Servicio del panel de creador - Conectado al backend

import type {
  Analytics,
  CustomGift,
  LoyaltyLevel,
  CreateGiftRequest,
  UpdateLoyaltyLevelsRequest,
} from '../types/api';
import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api.utils';

/**
 * Obtener analíticas del streamer
 */
export const getAnalytics = async (): Promise<Analytics> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_ANALYTICS}`;
  return apiGet<Analytics>(url, getAuthHeaders());
};

/**
 * Obtener regalos personalizados del streamer
 */
export const getCustomGifts = async (): Promise<CustomGift[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_GIFTS}`;
  const response = await apiGet<{ success: boolean; gifts: CustomGift[] }>(url, getAuthHeaders());
  return response.gifts;
};

/**
 * Crear un nuevo regalo personalizado
 */
export const createCustomGift = async (data: CreateGiftRequest): Promise<CustomGift> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_GIFTS}`;
  return apiPost<CustomGift>(url, data, getAuthHeaders());
};

/**
 * Editar un regalo existente
 */
export const updateCustomGift = async (
  id: string,
  data: CreateGiftRequest
): Promise<CustomGift> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_GIFT(id)}`;
  return apiPut<CustomGift>(url, data, getAuthHeaders());
};

/**
 * Eliminar un regalo
 */
export const deleteCustomGift = async (id: string): Promise<{ message: string }> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_GIFT(id)}`;
  return apiDelete<{ message: string }>(url, getAuthHeaders());
};

/**
 * Obtener niveles de lealtad del streamer
 */
export const getLoyaltyLevels = async (): Promise<LoyaltyLevel[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_LOYALTY_LEVELS}`;
  return apiGet<LoyaltyLevel[]>(url, getAuthHeaders());
};

/**
 * Actualizar/crear niveles de lealtad
 */
export const updateLoyaltyLevels = async (
  data: UpdateLoyaltyLevelsRequest
): Promise<LoyaltyLevel[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_LOYALTY_LEVELS}`;
  return apiPut<LoyaltyLevel[]>(url, data, getAuthHeaders());
};
/**
 * Enviar un regalo a un streamer
 */
export const sendGift = async (giftId: string, streamerId: string): Promise<{ success: boolean; message: string; pointsEarned: number }> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GIFTS_SEND}`;
  return apiPost(url, { giftId, streamerId }, getAuthHeaders());
};
