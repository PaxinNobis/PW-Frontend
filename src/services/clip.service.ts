// Servicio de Clips - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api.utils';

/**
 * Tipos de Clips
 */
export interface Clip {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  views: number;
  createdAt: Date;
  streamer: {
    id: string;
    name: string;
  };
}

export interface CreateClipRequest {
  url: string;
  title: string;
  thumbnail: string;
}

export interface UpdateClipRequest {
  title?: string;
  thumbnail?: string;
}

export interface GetClipsResponse {
  clips: Clip[];
  total: number;
  page: number;
}

/**
 * Obtener clips del streamer
 */
export const getClips = async (page: number = 1, limit: number = 10): Promise<GetClipsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip?page=${page}&limit=${limit}`;
  return apiGet<GetClipsResponse>(url, getAuthHeaders());
};

/**
 * Crear nuevo clip
 */
export const createClip = async (data: CreateClipRequest): Promise<Clip> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip`;
  return apiPost<Clip>(url, data, getAuthHeaders());
};

/**
 * Actualizar clip
 */
export const updateClip = async (id: string, data: UpdateClipRequest): Promise<{ success: boolean; clip: Clip }> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip/${id}`;
  return apiPut<{ success: boolean; clip: Clip }>(url, data, getAuthHeaders());
};

/**
 * Eliminar clip
 */
export const deleteClip = async (id: string): Promise<{ success: boolean; message: string }> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip/${id}`;
  return apiDelete<{ success: boolean; message: string }>(url, getAuthHeaders());
};

/**
 * Registrar vista de clip
 */
export const viewClip = async (id: string): Promise<{ success: boolean; newViewCount: number }> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip/${id}/view`;
  return apiPost<{ success: boolean; newViewCount: number }>(url, {}, API_CONFIG.HEADERS);
};

/**
 * Obtener clips en tendencia
 */
export const getTrendingClips = async (limit: number = 10): Promise<{ clips: Clip[] }> => {
  const url = `${API_CONFIG.BASE_URL}/api/clip/trending?limit=${limit}`;
  return apiGet<{ clips: Clip[] }>(url, API_CONFIG.HEADERS);
};
