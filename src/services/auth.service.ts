// Servicio de autenticación - Conectado al backend

import type { User, LoginCredentials, SignupData, AuthResponse } from '../types/auth';
import { API_CONFIG, setAuthToken, removeAuthToken, getAuthHeaders } from '../config/api.config';
import { apiPost, apiGet } from '../utils/api.utils';

const USER_STORAGE_KEY = 'streaming_user';

/**
 * Registrar un nuevo usuario
 */
export const signupUser = async (data: SignupData): Promise<User> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_REGISTER}`;
  const response = await apiPost<AuthResponse>(url, data, API_CONFIG.HEADERS);

  // Guardar token y usuario
  setAuthToken(response.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

  return response.user;
};

/**
 * Iniciar sesión
 */
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_LOGIN}`;
  const response = await apiPost<AuthResponse>(url, credentials, API_CONFIG.HEADERS);

  // Guardar token y usuario
  setAuthToken(response.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

  return response.user;
};

/**
 * Obtener información del usuario actual desde el servidor
 */
export const fetchCurrentUser = async (): Promise<User> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_ME}`;
  const response = await apiGet<{ success: boolean; user: User }>(url, getAuthHeaders());

  // Asegurar que la imagen de perfil sea válida
  const userToSave = {
    ...response.user,
    pfp: (response.user.pfp && response.user.pfp !== "undefined")
      ? response.user.pfp
      : "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png"
  };

  // Actualizar localStorage
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));

  return userToSave;
};

/**
 * Cerrar sesión
 */
export const logoutUser = (): void => {
  removeAuthToken();
  localStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Obtener usuario actual desde localStorage (sin llamada al servidor)
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);

  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};
