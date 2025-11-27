// Hooks para streams y datos públicos

import { useApi } from './useApi';
import { getAllStreams, getAllTags, getAllGames, getStreamDetails, searchStreams } from '../services/data.service';

/**
 * Hook para obtener todos los streams
 */
export function useStreams() {
  return useApi(() => getAllStreams());
}

/**
 * Hook para obtener todos los tags
 */
export function useTags() {
  return useApi(() => getAllTags());
}

/**
 * Hook para obtener todos los juegos
 */
export function useGames() {
  return useApi(() => getAllGames());
}

/**
 * Hook para obtener detalles de un stream
 */
export function useStreamDetails(nickname: string) {
  return useApi(() => getStreamDetails(nickname), { immediate: !!nickname });
}

/**
 * Hook para buscar streams
 */
export function useSearchStreams(query: string) {
  return useApi(() => searchStreams(query), { immediate: !!query });
}
