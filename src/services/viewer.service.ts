// Servicio de Viewers - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost } from '../utils/api.utils';

/**
 * Tipos de Viewers
 */
export interface ActiveViewer {
  id: string;
  name: string;
  pfp: string;
  joinedAt: Date;
}

export interface JoinStreamResponse {
  success: boolean;
  currentViewers: number;
  viewersList: ActiveViewer[];
}

export interface LeaveStreamResponse {
  success: boolean;
  currentViewers: number;
}

export interface GetViewersResponse {
  viewers: ActiveViewer[];
  count: number;
}

export interface ViewerCountResponse {
  count: number;
}

/**
 * Unirse a un stream como espectador
 */
export const joinStream = async (streamId: string): Promise<JoinStreamResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/viewer/join/${streamId}`;
  return apiPost<JoinStreamResponse>(url, {}, getAuthHeaders());
};

/**
 * Salir de un stream
 */
export const leaveStream = async (streamId: string): Promise<LeaveStreamResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/viewer/leave/${streamId}`;
  return apiPost<LeaveStreamResponse>(url, {}, getAuthHeaders());
};

/**
 * Obtener lista de espectadores de un stream
 */
export const getViewers = async (streamId: string): Promise<GetViewersResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/viewer/viewers/${streamId}`;
  return apiGet<GetViewersResponse>(url, API_CONFIG.HEADERS);
};

/**
 * Obtener contador de espectadores
 */
export const getViewerCount = async (streamId: string): Promise<ViewerCountResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/viewer/viewer-count/${streamId}`;
  return apiGet<ViewerCountResponse>(url, API_CONFIG.HEADERS);
};

/**
 * Enviar heartbeat para mantener conexión activa
 */
export const sendHeartbeat = async (streamId: string): Promise<{ success: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/viewer/heartbeat/${streamId}`;
  return apiPost<{ success: boolean }>(url, {}, getAuthHeaders());
};
