import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPut } from '../utils/api.utils';

export interface LoyaltyLevel {
    id?: number; // Optional because backend might not return it or it might be generated
    nombre: string;
    puntosRequeridos: number;
    recompensa: string;
}

export interface LoyaltyLevelsResponse {
    levels: LoyaltyLevel[];
}

/**
 * Obtener los niveles de lealtad configurados
 */
export const getLoyaltyLevels = async (): Promise<LoyaltyLevel[]> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_LOYALTY_LEVELS}`;
    try {
        const response = await apiGet<LoyaltyLevelsResponse | LoyaltyLevel[]>(url, getAuthHeaders());
        // Handle both array response or object with levels property
        if (Array.isArray(response)) {
            return response;
        } else if (response && response.levels) {
            return response.levels;
        }
        return [];
    } catch (error) {
        console.error('Error fetching loyalty levels:', error);
        throw error;
    }
};

/**
 * Actualizar la configuración de niveles de lealtad
 */
export const updateLoyaltyLevels = async (levels: LoyaltyLevel[]): Promise<void> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_LOYALTY_LEVELS}`;
    try {
        // Backend expects { levels: [...] }
        await apiPut(url, { levels }, getAuthHeaders());
    } catch (error) {
        console.error('Error updating loyalty levels:', error);
        throw error;
    }
};

/**
 * Obtener los niveles de lealtad de un streamer específico (Público)
 */
export const getStreamerLoyaltyLevels = async (streamerId: string): Promise<LoyaltyLevel[]> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAMER_LOYALTY_LEVELS(streamerId)}`;
    try {
        const response = await apiGet<LoyaltyLevelsResponse | LoyaltyLevel[]>(url, getAuthHeaders());
        // Handle both array response or object with levels property
        if (Array.isArray(response)) {
            return response;
        } else if (response && response.levels) {
            return response.levels;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching loyalty levels for streamer ${streamerId}:`, error);
        return []; // Return empty array on error to avoid breaking UI
    }
};
