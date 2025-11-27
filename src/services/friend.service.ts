// Servicio de Amigos - Conectado al backend

import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPost, apiDelete } from '../utils/api.utils';

/**
 * Tipos de Amigos
 */
export interface Friend {
  id: string;
  name: string;
  email: string;
  pfp: string;
  online: boolean;
  lastSeen: Date;
}

export interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    pfp: string;
  };
  toUser: {
    id: string;
    name: string;
    pfp: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface SendFriendRequestRequest {
  friendId: string;
}

export interface FriendRequestsResponse {
  received: FriendRequest[];
  sent: FriendRequest[];
}

/**
 * Obtener lista de amigos
 */
export const getFriends = async (): Promise<{ friends: Friend[] }> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend`;
  return apiGet<{ friends: Friend[] }>(url, getAuthHeaders());
};

/**
 * Enviar solicitud de amistad
 */
export const sendFriendRequest = async (friendId: string): Promise<{ success: boolean; requestId: string }> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend/request`;
  return apiPost<{ success: boolean; requestId: string }>(url, { friendId }, getAuthHeaders());
};

/**
 * Obtener solicitudes de amistad
 */
export const getFriendRequests = async (): Promise<FriendRequestsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend/requests`;
  return apiGet<FriendRequestsResponse>(url, getAuthHeaders());
};

/**
 * Aceptar solicitud de amistad
 */
export const acceptFriendRequest = async (requestId: string): Promise<{ success: boolean }> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend/accept/${requestId}`;
  return apiPost<{ success: boolean }>(url, {}, getAuthHeaders());
};

/**
 * Rechazar solicitud de amistad
 */
export const rejectFriendRequest = async (requestId: string): Promise<{ success: boolean; message: string }> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend/reject/${requestId}`;
  return apiPost<{ success: boolean; message: string }>(url, {}, getAuthHeaders());
};

/**
 * Eliminar amigo
 */
export const deleteFriend = async (friendId: string): Promise<{ success: boolean; message: string }> => {
  const url = `${API_CONFIG.BASE_URL}/api/friend/${friendId}`;
  return apiDelete<{ success: boolean; message: string }>(url, getAuthHeaders());
};
