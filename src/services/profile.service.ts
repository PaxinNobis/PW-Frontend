// Servicio de Perfil - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPut } from '../utils/api.utils';

/**
 * Tipos de Perfil
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pfp: string;
  bio: string;
  online: boolean;
  lastSeen: Date;
  coins: number;
  stats: {
    followers: number;
    following: number;
    streamingHours: number;
    totalViewers: number;
  };
  socialLinks: {
    x?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    discord?: string;
  };
}

export interface UpdateProfileRequest {
  bio?: string;
  name?: string;
}

export interface UpdateStatusRequest {
  online: boolean;
}

export interface UpdateSocialLinksRequest {
  x?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  discord?: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
}

/**
 * Obtener perfil de usuario
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/${userId}?t=${new Date().getTime()}`;
  const response = await apiGet<{ success: boolean; user: UserProfile }>(url, getAuthHeaders());
  return response.user;
};

/**
 * Actualizar perfil del usuario actual
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<{ success: boolean; updatedUser: UserProfile }> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile`;
  return apiPut<{ success: boolean; updatedUser: UserProfile }>(url, data, getAuthHeaders());
};

/**
 * Actualizar avatar
 */
export const updateAvatar = async (file: File): Promise<UploadAvatarResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/avatar`;
  const formData = new FormData();
  formData.append('avatar', file);

  const authHeaders = getAuthHeaders();
  const headers: Record<string, string> = {};

  if ('Authorization' in authHeaders) {
    headers['Authorization'] = authHeaders.Authorization as string;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir avatar');
  }

  return response.json();
};

/**
 * Actualizar estado online/offline
 */
export const updateStatus = async (online: boolean): Promise<{ success: boolean; online: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/status`;
  return apiPut<{ success: boolean; online: boolean }>(url, { online }, getAuthHeaders());
};

/**
 * Actualizar redes sociales
 */
export const updateSocialLinks = async (
  data: UpdateSocialLinksRequest
): Promise<{ success: boolean; socialLinks: UpdateSocialLinksRequest }> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/social-links`;
  return apiPut<{ success: boolean; socialLinks: UpdateSocialLinksRequest }>(url, data, getAuthHeaders());
};

/**
 * Obtener redes sociales del usuario actual
 */
export const getSocialLinks = async (): Promise<UpdateSocialLinksRequest> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/social-links/me`;
  return apiGet<UpdateSocialLinksRequest>(url, getAuthHeaders());
};
