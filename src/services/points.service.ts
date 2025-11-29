// Servicio de Puntos - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost } from '../utils/api.utils';
import type { SendPointsRequest, SendPointsResponse } from '../types/api';

/**
 * Tipos de Puntos
 */
export interface UserPoints {
  total: number;
  byStreamer: Array<{
    streamerId: string;
    streamerName: string;
    points: number;
  }>;
}

export interface EarnPointsRequest {
  streamerId: string;
  action: 'message_sent' | 'watch_time' | 'subscription' | 'donation';
  amount: number;
}

export interface EarnPointsResponse {
  success: boolean;
  pointsEarned: number;
  newTotal: number;
}

export interface PointsHistoryEntry {
  id: string;
  userId: string;
  streamerId: string;
  streamerName: string;
  action: string;
  points: number;
  createdAt: Date;
}

export interface PointsHistoryResponse {
  history: PointsHistoryEntry[];
  total: number;
  page: number;
}

/**
 * Obtener puntos del usuario
 */
export const getUserPoints = async (): Promise<UserPoints> => {
  const url = `${API_CONFIG.BASE_URL}/api/points`;
  return apiGet<UserPoints>(url, getAuthHeaders());
};

/**
 * Ganar puntos por acción
 */
export const earnPoints = async (data: EarnPointsRequest): Promise<EarnPointsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/points/earn`;
  return apiPost<EarnPointsResponse>(url, data, getAuthHeaders());
};

/**
 * Enviar puntos a un streamer
 */
export const sendPoints = async (data: SendPointsRequest): Promise<SendPointsResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POINTS_SEND}`;
  return apiPost<SendPointsResponse>(url, data, getAuthHeaders());
};

/**
 * Obtener historial de puntos
 */
export const getPointsHistory = async (
  streamerId?: string,
  page: number = 1,
  limit: number = 20
): Promise<PointsHistoryResponse> => {
  let url = `${API_CONFIG.BASE_URL}/api/points/history?page=${page}&limit=${limit}`;
  if (streamerId) {
    url += `&streamerId=${streamerId}`;
  }
  return apiGet<PointsHistoryResponse>(url, getAuthHeaders());
};
