// Servicio de datos públicos - Conectado al backend

import type { Stream, Tag, Game } from '../types/api';
import { API_CONFIG } from '../config/api.config';
import { apiGet } from '../utils/api.utils';

/**
 * Obtener todos los streams
 */
export const getAllStreams = async (): Promise<Stream[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_STREAMS}`;
  return apiGet<Stream[]>(url, API_CONFIG.HEADERS);
};

/**
 * Obtener todos los tags
 */
export const getAllTags = async (): Promise<Tag[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_TAGS}`;
  return apiGet<Tag[]>(url, API_CONFIG.HEADERS);
};

/**
 * Obtener todos los juegos
 */
export const getAllGames = async (): Promise<Game[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_GAMES}`;
  return apiGet<Game[]>(url, API_CONFIG.HEADERS);
};

/**
 * Obtener detalles de un stream por nickname del streamer
 */
export const getStreamDetails = async (nickname: string): Promise<Stream> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_STREAM_DETAILS(nickname)}`;
  return apiGet<Stream>(url, API_CONFIG.HEADERS);
};

/**
 * Buscar streams por título o nombre del streamer
 */
export const searchStreams = async (query: string): Promise<Stream[]> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_SEARCH(query)}`;
  return apiGet<Stream[]>(url, API_CONFIG.HEADERS);
};
