// Configuración centralizada de la API

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
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
    STREAMER_LEVELS_ALL: '/api/streamer/levels/all',
    STREAMER_HOURS: '/api/streamer/hours',
    STREAMER_STATS: '/api/streamer/stats',
    STREAMER_GIFTS: (streamerId: string) => `/api/streamer/${streamerId}/gifts`,
    STREAMER_LOYALTY_LEVELS: (streamerId: string) => `/api/streamer/${streamerId}/loyalty-levels`,
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
    PAYMENT_WEBHOOK: '/api/payment/webhook',
    PAYMENT_HISTORY: '/api/payment/transaction-history',
    PAYMENT_BALANCE: '/api/payment/balance',

    // Points
    POINTS_GET: '/api/points',
    POINTS_SEND: '/api/points/send',
    POINTS_EARN: '/api/points/earn',
    POINTS_HISTORY: '/api/points/history',

    // Medals
    MEDALS_USER: '/api/medals/user',
    MEDALS_AVAILABLE: '/api/medals/available',
    MEDALS_CREATE: '/api/medals',
    MEDALS_UPDATE: (id: string) => `/api/medals/${id}`,
    MEDALS_DELETE: (id: string) => `/api/medals/${id}`,
    MEDALS_AWARD: '/api/medals/award',

    // Notifications
    NOTIFICATIONS_GET: '/api/notifications',
    NOTIFICATIONS_READ: (id: string) => `/api/notifications/${id}/read`,
    NOTIFICATIONS_DELETE: (id: string) => `/api/notifications/${id}`,

    // Clips
    CLIPS_GET: '/api/clips',
    CLIPS_CREATE: '/api/clips',
    CLIPS_DELETE: (id: string) => `/api/clips/${id}`,

    // Friends
    FRIENDS_GET: '/api/friends',
    FRIENDS_REQUESTS: '/api/friends/requests',
    FRIENDS_REQUEST: '/api/friends/request',
    FRIENDS_ACCEPT: (requestId: string) => `/api/friends/accept/${requestId}`,
    FRIENDS_DELETE: (friendId: string) => `/api/friends/${friendId}`,

    // Panel
    // PANEL_LOYALTY_LEVELS already defined above
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
