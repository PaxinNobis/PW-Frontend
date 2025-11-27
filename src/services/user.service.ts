// Servicio de usuario - Conectado al backend

import type { Following, FollowResponse } from '../types/api';
import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost } from '../utils/api.utils';

/**
 * Obtener lista de streamers que el usuario sigue
 */
export const getFollowing = async (): Promise<Following[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_FOLLOWING}`;
  return apiGet<Following[]>(url, getAuthHeaders());
};

/**
 * Seguir o dejar de seguir a un streamer
 */
export const toggleFollow = async (streamerId: string): Promise<FollowResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_FOLLOW(streamerId)}`;
  return apiPost<FollowResponse>(url, undefined, getAuthHeaders());
};
