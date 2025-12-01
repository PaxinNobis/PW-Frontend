// Configuración centralizada de la API

export const API_CONFIG = {
  BASE_URL: 'https://astrotv.onrender.com',
  ENDPOINTS: {
    // Auth
    AUTH_REGISTER: '/api/auth/register',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_ME: '/api/auth/me',

    // User
    USER_FOLLOWING: '/api/user/following',
    USER_FOLLOW: (streamerId: string) => `/api/user/follow/${streamerId}`,

    // Data
    DATA_STREAMS: '/api/data/streams',
    DATA_TAGS: '/api/data/tags',
    DATA_GAMES: '/api/data/games',
    DATA_STREAM_DETAILS: (nickname: string) => `/api/data/streams/details/${nickname}`,
    DATA_SEARCH: (query: string) => `/api/data/search/${query}`,

    // Streamer
    STREAMER_LEVEL: '/api/streamer/level',
    STREAMER_STATS: '/api/streamer/stats',
    STREAMER_GIFTS: (streamerId: string) => `/api/streamer/${streamerId}/gifts`,
    STREAMER_LOYALTY_LEVELS: (streamerId: string) => `/api/streamer/${streamerId}/loyalty-levels`,
    STREAMER_LOYALTY_TEMPLATES: '/api/streamer/loyalty-templates',

    // Panel
    PANEL_ANALYTICS: '/api/panel/analytics',
    PANEL_GIFTS: '/api/panel/gifts',
    PANEL_GIFT: (id: string) => `/api/panel/gifts/${id}`,
    PANEL_LOYALTY_LEVELS: '/api/panel/loyalty-levels',

    // Gifts
    GIFTS_SEND: '/api/gifts/send',

    // Chat
    CHAT_SEND: '/api/chat/send',
    CHAT_MESSAGES: (streamId: string) => `/api/chat/messages/${streamId}`,
    CHAT_DELETE_MESSAGE: (messageId: string) => `/api/chat/message/${messageId}`,

    // Payment
    PAYMENT_COIN_PACKS: '/api/payment/coin-packs',
    PAYMENT_CHECKOUT: '/api/payment/create-checkout-session',
    PAYMENT_HISTORY: '/api/payment/transaction-history',
    PAYMENT_BALANCE: '/api/payment/balance',
    PAYMENT_VERIFY_SESSION: '/api/payment/verify-session',

    // Points
    POINTS_GET: '/api/points',
    POINTS_SEND: '/api/points/send',
    POINTS_EARN: '/api/points/earn',
    POINTS_HISTORY: '/api/points/history',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper para obtener el token de autenticación
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper para guardar el token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper para eliminar el token
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Helper para crear headers con autenticación
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    ...API_CONFIG.HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
