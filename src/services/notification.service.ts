// Servicio de Notificaciones - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPut, apiDelete } from '../utils/api.utils';

/**
 * Tipos de Notificaciones
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'new_follower' | 'level_up' | 'medal_earned' | 'stream_started';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

/**
 * Obtener notificaciones del usuario
 */
export const getNotifications = async (
  unread?: boolean,
  page: number = 1,
  limit: number = 20
): Promise<NotificationsResponse> => {
  let url = `${API_CONFIG.BASE_URL}/api/notification?page=${page}&limit=${limit}`;
  if (unread !== undefined) {
    url += `&unread=${unread}`;
  }
  return apiGet<NotificationsResponse>(url, getAuthHeaders());
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (id: string): Promise<{ success: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/notification/${id}/read`;
  return apiPut<{ success: boolean }>(url, {}, getAuthHeaders());
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<{ success: boolean; count: number }> => {
  const url = `${API_CONFIG.BASE_URL}/api/notification/read-all`;
  return apiPut<{ success: boolean; count: number }>(url, {}, getAuthHeaders());
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (id: string): Promise<{ success: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/notification/${id}`;
  return apiDelete<{ success: boolean }>(url, getAuthHeaders());
};
