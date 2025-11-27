// Hooks para el panel de creador

import { useApi, useMutation } from './useApi';
import {
  getAnalytics,
  getCustomGifts,
  createCustomGift,
  updateCustomGift,
  deleteCustomGift,
  getLoyaltyLevels,
  updateLoyaltyLevels,
} from '../services/panel.service';
import type { CreateGiftRequest, UpdateLoyaltyLevelsRequest } from '../types/api';

/**
 * Hook para obtener analíticas del streamer
 */
export function useAnalytics() {
  return useApi(() => getAnalytics());
}

/**
 * Hook para obtener regalos personalizados
 */
export function useCustomGifts() {
  return useApi(() => getCustomGifts());
}

/**
 * Hook para crear un regalo personalizado
 */
export function useCreateGift() {
  return useMutation((data: CreateGiftRequest) => createCustomGift(data));
}

/**
 * Hook para actualizar un regalo
 */
export function useUpdateGift() {
  return useMutation(({ id, data }: { id: string; data: CreateGiftRequest }) =>
    updateCustomGift(id, data)
  );
}

/**
 * Hook para eliminar un regalo
 */
export function useDeleteGift() {
  return useMutation((id: string) => deleteCustomGift(id));
}

/**
 * Hook para obtener niveles de lealtad
 */
export function useLoyaltyLevels() {
  return useApi(() => getLoyaltyLevels());
}

/**
 * Hook para actualizar niveles de lealtad
 */
export function useUpdateLoyaltyLevels() {
  return useMutation((data: UpdateLoyaltyLevelsRequest) => updateLoyaltyLevels(data));
}
