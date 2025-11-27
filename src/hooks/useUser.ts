// Hooks para usuario

import { useApi, useMutation } from './useApi';
import { getFollowing, toggleFollow } from '../services/user.service';

/**
 * Hook para obtener streamers que el usuario sigue
 */
export function useFollowing() {
  return useApi(() => getFollowing());
}

/**
 * Hook para seguir/dejar de seguir a un streamer
 */
export function useToggleFollow() {
  return useMutation((streamerId: string) => toggleFollow(streamerId));
}
