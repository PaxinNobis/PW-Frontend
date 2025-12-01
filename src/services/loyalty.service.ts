import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { apiGet, apiPut } from '../utils/api.utils';

export interface LoyaltyLevel {
    id?: number; // Optional because backend might not return it or it might be generated
    nombre: string;
    puntosRequeridos: number;
    recompensa: string;
    image?: string; // URL de la imagen del nivel (opcional)
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
        // Manejar respuesta como array u objeto con propiedad levels
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
 * Obtener plantillas de niveles de lealtad (ej. Sistema Solar)
 */
export const getLoyaltyTemplates = async (): Promise<LoyaltyLevel[]> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAMER_LOYALTY_TEMPLATES}`;
    try {
        // The backend returns { success: boolean, templates: [{ id, level, foto }] }
        const response = await apiGet<any>(url, getAuthHeaders());

        if (response && response.templates && Array.isArray(response.templates)) {
            return response.templates.map((t: any) => ({
                id: t.id,
                nombre: t.level, // Map 'level' to 'nombre'
                image: t.foto,   // Map 'foto' to 'image'
                puntosRequeridos: 0, // Default
                recompensa: ''       // Default
            }));
        }

        return [];
    } catch (error) {
        console.error('Error fetching loyalty templates:', error);
        throw error;
    }
};

/**
 * Actualizar la configuración de niveles de lealtad
 */
export const updateLoyaltyLevels = async (levels: LoyaltyLevel[]): Promise<void> => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PANEL_LOYALTY_LEVELS}`;
    try {
        // Backend espera { levels: [...] }
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
        // Manejar respuesta como array u objeto con propiedad levels
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
