// Servicio de Niveles de Streamer - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPut } from '../utils/api.utils';

/**
 * Tipos de Niveles de Streamer
 */
export interface Level {
  id: number;
  level: string;
  min_followers: number;
  max_followers: number;
  min_hours: number;
  max_hours: number;
}

export interface StreamerLevelResponse {
  currentLevel: {
    id: number;
    name: string;
    minFollowers: number;
    maxFollowers: number;
    minHours: number;
    maxHours: number;
  };
  progress: {
    currentHours: number;
    currentFollowers: number;
    hoursProgress: number;
    followersProgress: number;
  };
  nextLevel: {
    id: number;
    name: string;
    minFollowers: number;
    maxFollowers: number;
    minHours: number;
    maxHours: number;
  } | null;
}

export interface UpdateHoursRequest {
  hours: number;
}

export interface UpdateHoursResponse {
  success: boolean;
  newTotal: number;
  levelUp: boolean;
  newLevel: Level | null;
}

export interface StreamerStats {
  followers: number;
  streamingHours: number;
  totalViewers: number;
  averageViewers: number;
  peakViewers: number;
  totalStreams: number;
}

/**
 * Obtener nivel actual del streamer
 */
export const getStreamerLevel = async (): Promise<StreamerLevelResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAMER_LEVEL}`;
  return apiGet<StreamerLevelResponse>(url, getAuthHeaders());
};

/**
 * Actualizar horas transmitidas
 */
export const updateStreamingHours = async (hours: number): Promise<UpdateHoursResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/streamer/hours`;
  return apiPut<UpdateHoursResponse>(url, { hours }, getAuthHeaders());
};

/**
 * Obtener estadísticas del streamer
 */
export const getStreamerStats = async (): Promise<StreamerStats> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAMER_STATS}`;
  return apiGet<StreamerStats>(url, getAuthHeaders());
};

/**
 * Obtener regalos configurados por un streamer
 */
import type { CustomGift } from '../types/api';

export const getStreamerGifts = async (streamerId: string): Promise<{ success: boolean; gifts: CustomGift[] }> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAMER_GIFTS(streamerId)}`;
  return apiGet<{ success: boolean; gifts: CustomGift[] }>(url, getAuthHeaders());
};

/**
 * Configuración del Stream
 */
export interface StreamSettings {
  title?: string;
  gameId?: string;
  tags?: string[];
  iframeUrl?: string;
  isLive?: boolean;
}

export interface UpdateStreamSettingsResponse {
  success: boolean;
  message: string;
  stream: any; // Se podría tipar mejor con la interfaz Stream completa
}

/**
 * Actualizar configuración del stream
 */
export const updateStreamSettings = async (settings: StreamSettings): Promise<UpdateStreamSettingsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/streamer/settings`;
  return apiPut<UpdateStreamSettingsResponse>(url, settings, getAuthHeaders());
};

/**
 * Iniciar Stream
 */
export const startStream = async (): Promise<UpdateStreamSettingsResponse> => {
  return updateStreamSettings({ isLive: true });
};

/**
 * Detener Stream
 */
export const stopStream = async (): Promise<UpdateStreamSettingsResponse> => {
  return updateStreamSettings({ isLive: false });
};
