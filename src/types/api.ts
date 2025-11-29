// Tipos para la API completa

// ============ STREAMS ============
export interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  streamer: {
    id: string;
    name: string;
    email: string;
  };
  game: {
    id: string;
    name: string;
    photo: string;
  };
  tags: Tag[];
}

// ============ TAGS ============
export interface Tag {
  id: string;
  name: string;
  _count?: {
    streams: number;
    games: number;
  };
}

// ============ GAMES ============
export interface Game {
  id: string;
  name: string;
  photo: string;
  tags: Tag[];
  _count?: {
    streams: number;
  };
}

// ============ USER ============
export interface Following {
  id: string;
  name: string;
  email: string;
  stream: {
    id: string;
    title: string;
    thumbnail: string;
    viewers: number;
    isLive: boolean;
  };
}

export interface FollowResponse {
  message: string;
  isFollowing: boolean;
}

// ============ PANEL ============
export interface Analytics {
  id: string;
  horasTransmitidas: number;
  monedasRecibidas: number;
  streamerId: string;
}

export interface CustomGift {
  id: string;
  nombre: string;
  costo: number;
  puntos: number;
  streamerId: string;
}

export interface LoyaltyLevel {
  id: string;
  nombre: string;
  puntosRequeridos: number;
  recompensa: string;
  streamerId: string;
}

export interface CreateGiftRequest {
  nombre: string;
  costo: number;
  puntos: number;
}

export interface UpdateLoyaltyLevelsRequest {
  levels: Array<{
    nombre: string;
    puntosRequeridos: number;
    recompensa: string;
  }>;
}

// ============ PAYMENT ============
export interface CoinPack {
  id: string;
  nombre: string;
  valor: number;
  en_soles: number;
}

export interface CheckoutSessionRequest {
  coinPackId: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface WebhookResponse {
  received: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  coins: number;
  status: string;
  createdAt: string;
  pack: {
    nombre: string;
  };
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BalanceResponse {
  coins: number;
  lastPurchase?: {
    date: string;
    amount: number;
    coins: number;
  };
}

// ============ POINTS ============
export interface SendPointsRequest {
  streamerId: string;
  points: number;
}

export interface SendPointsResponse {
  success: boolean;
  newBalance: number;
  streamerReceived: number;
}
