// Servicio de Medallas - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api.utils';

/**
 * Tipos de Medallas
 */
export interface Medal {
  id: string;
  level: string;
  name: string;
  description: string;
  minMessages: number;
  minPoints: number;
  streamerId: string;
}

export interface UserMedal {
  id: string;
  level: string;
  name: string;
  description: string;
  earnedDate: Date;
  streamer: {
    id: string;
    name: string;
  };
}

export interface CreateMedalRequest {
  level: string;
  name: string;
  description: string;
  requirements: {
    minMessages: number;
    minPoints: number;
  };
}

export interface AwardMedalRequest {
  userId: string;
  medalId: string;
}

export interface GetUserMedalsResponse {
  medals: UserMedal[];
  total: number;
}

export interface GetAvailableMedalsResponse {
  medals: Medal[];
}

/**
 * Obtener medallas del usuario
 */
export const getUserMedals = async (): Promise<GetUserMedalsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal/user`;
  return apiGet<GetUserMedalsResponse>(url, getAuthHeaders());
};

/**
 * Obtener medallas disponibles del streamer
 */
export const getAvailableMedals = async (): Promise<GetAvailableMedalsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal/available`;
  return apiGet<GetAvailableMedalsResponse>(url, getAuthHeaders());
};

/**
 * Crear nueva medalla (solo streamers)
 */
export const createMedal = async (data: CreateMedalRequest): Promise<Medal> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal`;
  return apiPost<Medal>(url, data, getAuthHeaders());
};

/**
 * Actualizar medalla existente
 */
export const updateMedal = async (
  id: string,
  data: Partial<CreateMedalRequest>
): Promise<Medal> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal/${id}`;
  return apiPut<Medal>(url, data, getAuthHeaders());
};

/**
 * Eliminar medalla
 */
export const deleteMedal = async (id: string): Promise<{ success: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal/${id}`;
  return apiDelete<{ success: boolean }>(url, getAuthHeaders());
};

/**
 * Otorgar medalla a un usuario
 */
export const awardMedal = async (data: AwardMedalRequest): Promise<{ success: boolean; userMedal: UserMedal }> => {
  const url = `${API_CONFIG.BASE_URL}/api/medal/award`;
  return apiPost<{ success: boolean; userMedal: UserMedal }>(url, data, getAuthHeaders());
};
