# 📋 Qué Falta Implementar - Backend con Types Completos

> **Nota:** Este documento incluye todos los endpoints pendientes con sus tipos TypeScript completos para el backend.

---

## 🔴 CRÍTICO - Funcionalidades Core

### 1. **Chat en Tiempo Real**

#### Endpoints

##### POST `/api/chat/send`
Enviar un mensaje al chat de un stream.

**Types:**
```typescript
interface SendMessageRequest {
  streamId: string;
  texto: string;
}

interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  texto: string;
  hora: string;
  user: {
    id: string;
    name: string;
    pfp: string;
  };
  createdAt: Date;
}

interface SendMessageResponse {
  message: ChatMessage;
  pointsEarned: number;
}
```

**Request:**
```http
POST /api/chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "streamId": "stream-123",
  "texto": "Hola a todos!"
}
```

**Response (200):**
```json
{
  "message": {
    "id": "msg-456",
    "streamId": "stream-123",
    "userId": "user-789",
    "texto": "Hola a todos!",
    "hora": "14:30:25",
    "user": {
      "id": "user-789",
      "name": "JohnDoe",
      "pfp": "https://example.com/avatar.jpg"
    },
    "createdAt": "2025-11-27T14:30:25.000Z"
  },
  "pointsEarned": 1
}
```

---

##### GET `/api/chat/messages/:streamId`
Obtener historial de mensajes de un stream.

**Types:**
```typescript
interface GetMessagesResponse {
  messages: ChatMessage[];
  total: number;
}
```

**Request:**
```http
GET /api/chat/messages/stream-123?limit=50&offset=0
```

**Response (200):**
```json
{
  "messages": [
    {
      "id": "msg-456",
      "streamId": "stream-123",
      "userId": "user-789",
      "texto": "Hola a todos!",
      "hora": "14:30:25",
      "user": {
        "id": "user-789",
        "name": "JohnDoe",
        "pfp": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-11-27T14:30:25.000Z"
    }
  ],
  "total": 150
}
```

---

##### DELETE `/api/chat/message/:messageId`
Eliminar un mensaje (solo moderadores/streamer).

**Types:**
```typescript
interface DeleteMessageResponse {
  success: boolean;
  message: string;
}
```

**Request:**
```http
DELETE /api/chat/message/msg-456
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Mensaje eliminado"
}
```

---

##### WebSocket `/api/chat/stream/:streamId`
Conexión en tiempo real para chat.

**Types:**
```typescript
// Eventos del servidor al cliente
interface ChatEvents {
  new_message: ChatMessage;
  user_joined: {
    userId: string;
    userName: string;
    timestamp: Date;
  };
  user_left: {
    userId: string;
    userName: string;
    timestamp: Date;
  };
  message_deleted: {
    messageId: string;
    deletedBy: string;
  };
}

// Eventos del cliente al servidor
interface ChatClientEvents {
  send_message: {
    texto: string;
  };
  typing: {
    isTyping: boolean;
  };
}
```

**Uso:**
```typescript
const socket = io('ws://localhost:8080/api/chat/stream/stream-123', {
  auth: { token: 'Bearer <token>' }
});

socket.on('new_message', (message: ChatMessage) => {
  console.log('Nuevo mensaje:', message);
});

socket.emit('send_message', { texto: 'Hola!' });
```

---

#### Base de Datos

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_chat_messages_stream ON chat_messages(stream_id, created_at DESC);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
```

---

### 2. **Viewers en Vivo**

#### Endpoints

##### POST `/api/stream/join/:streamId`
Unirse a un stream como espectador.

**Types:**
```typescript
interface ActiveViewer {
  id: string;
  name: string;
  pfp: string;
  joinedAt: Date;
}

interface JoinStreamResponse {
  success: boolean;
  currentViewers: number;
  viewersList: ActiveViewer[];
}
```

**Request:**
```http
POST /api/stream/join/stream-123
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "currentViewers": 42,
  "viewersList": [
    {
      "id": "user-789",
      "name": "JohnDoe",
      "pfp": "https://example.com/avatar.jpg",
      "joinedAt": "2025-11-27T14:30:25.000Z"
    }
  ]
}
```

---

##### POST `/api/stream/leave/:streamId`
Salir de un stream.

**Types:**
```typescript
interface LeaveStreamResponse {
  success: boolean;
  currentViewers: number;
}
```

**Request:**
```http
POST /api/stream/leave/stream-123
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "currentViewers": 41
}
```

---

##### GET `/api/stream/viewers/:streamId`
Obtener lista de espectadores actuales.

**Types:**
```typescript
interface GetViewersResponse {
  viewers: ActiveViewer[];
  count: number;
}
```

**Request:**
```http
GET /api/stream/viewers/stream-123
```

**Response (200):**
```json
{
  "viewers": [
    {
      "id": "user-789",
      "name": "JohnDoe",
      "pfp": "https://example.com/avatar.jpg",
      "joinedAt": "2025-11-27T14:30:25.000Z"
    }
  ],
  "count": 42
}
```

---

##### GET `/api/stream/viewer-count/:streamId`
Obtener solo el número de espectadores.

**Types:**
```typescript
interface ViewerCountResponse {
  count: number;
}
```

**Request:**
```http
GET /api/stream/viewer-count/stream-123
```

**Response (200):**
```json
{
  "count": 42
}
```

---

##### WebSocket `/api/stream/viewers/:streamId`
Actualizaciones en tiempo real de espectadores.

**Types:**
```typescript
interface ViewerEvents {
  viewer_joined: {
    viewer: ActiveViewer;
    newCount: number;
  };
  viewer_left: {
    viewerId: string;
    viewerName: string;
    newCount: number;
  };
  viewer_count_update: {
    count: number;
  };
}
```

---

#### Base de Datos

```sql
CREATE TABLE active_viewers (
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_heartbeat TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (stream_id, user_id)
);

CREATE INDEX idx_active_viewers_stream ON active_viewers(stream_id);
CREATE INDEX idx_active_viewers_heartbeat ON active_viewers(last_heartbeat);

-- Función para limpiar viewers inactivos (más de 30 segundos sin heartbeat)
CREATE OR REPLACE FUNCTION cleanup_inactive_viewers()
RETURNS void AS $$
BEGIN
  DELETE FROM active_viewers
  WHERE last_heartbeat < NOW() - INTERVAL '30 seconds';
END;
$$ LANGUAGE plpgsql;
```

---

### 3. **Confirmación de Pagos**

#### Endpoints

##### POST `/api/payment/confirm-purchase`
Confirmar compra después de pago exitoso.

**Types:**
```typescript
interface ConfirmPurchaseRequest {
  sessionId: string;
  userId: string;
}

interface Transaction {
  id: string;
  userId: string;
  packId: string;
  amount: number;
  coins: number;
  status: 'pending' | 'completed' | 'failed';
  stripeSessionId: string;
  createdAt: Date;
  completedAt?: Date;
}

interface ConfirmPurchaseResponse {
  success: boolean;
  newCoinBalance: number;
  transaction: Transaction;
}
```

**Request:**
```http
POST /api/payment/confirm-purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "cs_test_123456",
  "userId": "user-789"
}
```

**Response (200):**
```json
{
  "success": true,
  "newCoinBalance": 1500,
  "transaction": {
    "id": "txn-123",
    "userId": "user-789",
    "packId": "pack-1",
    "amount": 9.99,
    "coins": 500,
    "status": "completed",
    "stripeSessionId": "cs_test_123456",
    "createdAt": "2025-11-27T14:30:25.000Z",
    "completedAt": "2025-11-27T14:30:30.000Z"
  }
}
```

---

##### GET `/api/payment/transaction-history`
Obtener historial de transacciones.

**Types:**
```typescript
interface TransactionHistoryQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed';
}

interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
```

**Request:**
```http
GET /api/payment/transaction-history?page=1&limit=10&status=completed
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "txn-123",
      "userId": "user-789",
      "packId": "pack-1",
      "amount": 9.99,
      "coins": 500,
      "status": "completed",
      "stripeSessionId": "cs_test_123456",
      "createdAt": "2025-11-27T14:30:25.000Z",
      "completedAt": "2025-11-27T14:30:30.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

##### GET `/api/payment/balance`
Obtener balance actual de monedas.

**Types:**
```typescript
interface BalanceResponse {
  coins: number;
  lastPurchase?: {
    date: Date;
    amount: number;
    coins: number;
  };
}
```

**Request:**
```http
GET /api/payment/balance
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "coins": 1500,
  "lastPurchase": {
    "date": "2025-11-27T14:30:30.000Z",
    "amount": 9.99,
    "coins": 500
  }
}
```

---

#### Base de Datos

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES coin_packs(id),
  amount DECIMAL(10, 2) NOT NULL,
  coins INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  error_message TEXT
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_stripe_session ON transactions(stripe_session_id);
```

---

## 🟡 IMPORTANTE - Engagement

### 4. **Sistema de Puntos**

#### Endpoints

##### GET `/api/user/points`
Obtener puntos del usuario.

**Types:**
```typescript
interface UserPoints {
  total: number;
  byStreamer: Array<{
    streamerId: string;
    streamerName: string;
    points: number;
  }>;
}
```

**Request:**
```http
GET /api/user/points
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total": 1250,
  "byStreamer": [
    {
      "streamerId": "streamer-1",
      "streamerName": "CoolStreamer",
      "points": 850
    },
    {
      "streamerId": "streamer-2",
      "streamerName": "AwesomeGamer",
      "points": 400
    }
  ]
}
```

---

##### POST `/api/user/points/send`
Enviar puntos a un streamer.

**Types:**
```typescript
interface SendPointsRequest {
  streamerId: string;
  points: number;
}

interface SendPointsResponse {
  success: boolean;
  newBalance: number;
  streamerReceived: number;
}
```

**Request:**
```http
POST /api/user/points/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "streamerId": "streamer-1",
  "points": 100
}
```

**Response (200):**
```json
{
  "success": true,
  "newBalance": 750,
  "streamerReceived": 950
}
```

---

##### GET `/api/user/points/history`
Obtener historial de puntos.

**Types:**
```typescript
interface PointsHistoryQuery {
  streamerId?: string;
  page?: number;
  limit?: number;
}

interface PointsHistoryEntry {
  id: string;
  userId: string;
  streamerId: string;
  streamerName: string;
  action: string;
  points: number;
  createdAt: Date;
}

interface PointsHistoryResponse {
  history: PointsHistoryEntry[];
  total: number;
  page: number;
}
```

**Request:**
```http
GET /api/user/points/history?streamerId=streamer-1&page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "history": [
    {
      "id": "ph-123",
      "userId": "user-789",
      "streamerId": "streamer-1",
      "streamerName": "CoolStreamer",
      "action": "message_sent",
      "points": 1,
      "createdAt": "2025-11-27T14:30:25.000Z"
    }
  ],
  "total": 150,
  "page": 1
}
```

---

##### POST `/api/user/points/earn`
Ganar puntos por acción.

**Types:**
```typescript
interface EarnPointsRequest {
  streamerId: string;
  action: 'message_sent' | 'watch_time' | 'subscription' | 'donation';
  amount: number;
}

interface EarnPointsResponse {
  success: boolean;
  pointsEarned: number;
  newTotal: number;
}
```

**Request:**
```http
POST /api/user/points/earn
Authorization: Bearer <token>
Content-Type: application/json

{
  "streamerId": "streamer-1",
  "action": "message_sent",
  "amount": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "pointsEarned": 1,
  "newTotal": 851
}
```

---

#### Base de Datos

```sql
CREATE TABLE user_points (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streamer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, streamer_id)
);

CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streamer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_points_user ON user_points(user_id);
CREATE INDEX idx_user_points_streamer ON user_points(streamer_id);
CREATE INDEX idx_points_history_user ON points_history(user_id, created_at DESC);
CREATE INDEX idx_points_history_streamer ON points_history(streamer_id, created_at DESC);
```

---

### 5. **Sistema de Medallas**

#### Endpoints

##### GET `/api/user/medals`
Obtener medallas del usuario.

**Types:**
```typescript
interface UserMedal {
  id: string;
  level: string;
  name: string;
  description: string;
  earnedDate: Date;
  streamer: {
    id: string;
    name: string;
  };
}

interface GetUserMedalsResponse {
  medals: UserMedal[];
  total: number;
}
```

**Request:**
```http
GET /api/user/medals
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "medals": [
    {
      "id": "medal-123",
      "level": "Bronce",
      "name": "Chatter Novato",
      "description": "Envió 100 mensajes",
      "earnedDate": "2025-11-27T14:30:25.000Z",
      "streamer": {
        "id": "streamer-1",
        "name": "CoolStreamer"
      }
    }
  ],
  "total": 5
}
```

---

##### GET `/api/streamer/medals/available`
Obtener medallas disponibles del streamer.

**Types:**
```typescript
interface Medal {
  id: string;
  level: string;
  name: string;
  description: string;
  minMessages: number;
  minPoints: number;
  streamerId: string;
}

interface GetAvailableMedalsResponse {
  medals: Medal[];
}
```

**Request:**
```http
GET /api/streamer/medals/available
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "medals": [
    {
      "id": "medal-123",
      "level": "Bronce",
      "name": "Chatter Novato",
      "description": "Envió 100 mensajes",
      "minMessages": 100,
      "minPoints": 0,
      "streamerId": "streamer-1"
    }
  ]
}
```

---

##### POST `/api/streamer/medals/create`
Crear nueva medalla.

**Types:**
```typescript
interface CreateMedalRequest {
  level: string;
  name: string;
  description: string;
  requirements: {
    minMessages: number;
    minPoints: number;
  };
}

interface CreateMedalResponse {
  id: string;
  level: string;
  name: string;
  description: string;
  minMessages: number;
  minPoints: number;
  streamerId: string;
}
```

**Request:**
```http
POST /api/streamer/medals/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "level": "Oro",
  "name": "Super Fan",
  "description": "Envió 1000 mensajes y tiene 5000 puntos",
  "requirements": {
    "minMessages": 1000,
    "minPoints": 5000
  }
}
```

**Response (201):**
```json
{
  "id": "medal-456",
  "level": "Oro",
  "name": "Super Fan",
  "description": "Envió 1000 mensajes y tiene 5000 puntos",
  "minMessages": 1000,
  "minPoints": 5000,
  "streamerId": "streamer-1"
}
```

---

##### PUT `/api/streamer/medals/:id`
Actualizar medalla existente.

**Types:**
```typescript
interface UpdateMedalRequest {
  level?: string;
  name?: string;
  description?: string;
  requirements?: {
    minMessages?: number;
    minPoints?: number;
  };
}

interface UpdateMedalResponse {
  success: boolean;
  medal: Medal;
}
```

---

##### DELETE `/api/streamer/medals/:id`
Eliminar medalla.

**Types:**
```typescript
interface DeleteMedalResponse {
  success: boolean;
  message: string;
}
```

---

##### POST `/api/streamer/medals/award`
Otorgar medalla a un usuario.

**Types:**
```typescript
interface AwardMedalRequest {
  userId: string;
  medalId: string;
}

interface AwardMedalResponse {
  success: boolean;
  userMedal: UserMedal;
}
```

**Request:**
```http
POST /api/streamer/medals/award
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-789",
  "medalId": "medal-123"
}
```

**Response (200):**
```json
{
  "success": true,
  "userMedal": {
    "id": "um-999",
    "level": "Bronce",
    "name": "Chatter Novato",
    "description": "Envió 100 mensajes",
    "earnedDate": "2025-11-27T14:30:25.000Z",
    "streamer": {
      "id": "streamer-1",
      "name": "CoolStreamer"
    }
  }
}
```

---

#### Base de Datos

```sql
CREATE TABLE medals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  min_messages INTEGER DEFAULT 0,
  min_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_medals (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medal_id UUID NOT NULL REFERENCES medals(id) ON DELETE CASCADE,
  streamer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, medal_id)
);

CREATE INDEX idx_medals_streamer ON medals(streamer_id);
CREATE INDEX idx_user_medals_user ON user_medals(user_id);
CREATE INDEX idx_user_medals_streamer ON user_medals(streamer_id);
```

---

### 6. **Perfil de Usuario Completo**

#### Endpoints

##### GET `/api/user/profile/:userId`
Obtener perfil de usuario.

**Types:**
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  pfp: string;
  bio: string;
  online: boolean;
  lastSeen: Date;
  stats: {
    followers: number;
    following: number;
    streamingHours: number;
    totalViewers: number;
  };
  socialLinks: {
    x?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    discord?: string;
  };
}
```

**Request:**
```http
GET /api/user/profile/user-789
```

**Response (200):**
```json
{
  "id": "user-789",
  "name": "JohnDoe",
  "email": "john@example.com",
  "pfp": "https://example.com/avatar.jpg",
  "bio": "Streamer de videojuegos",
  "online": true,
  "lastSeen": "2025-11-27T14:30:25.000Z",
  "stats": {
    "followers": 1250,
    "following": 45,
    "streamingHours": 320,
    "totalViewers": 15000
  },
  "socialLinks": {
    "x": "https://x.com/johndoe",
    "youtube": "https://youtube.com/@johndoe",
    "instagram": "https://instagram.com/johndoe"
  }
}
```

---

##### PUT `/api/user/profile`
Actualizar perfil.

**Types:**
```typescript
interface UpdateProfileRequest {
  bio?: string;
  name?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  updatedUser: UserProfile;
}
```

**Request:**
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Streamer profesional de FPS",
  "name": "JohnDoe Pro"
}
```

**Response (200):**
```json
{
  "success": true,
  "updatedUser": {
    "id": "user-789",
    "name": "JohnDoe Pro",
    "bio": "Streamer profesional de FPS",
    ...
  }
}
```

---

##### POST `/api/user/upload-avatar`
Subir foto de perfil.

**Types:**
```typescript
interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
}
```

**Request:**
```http
POST /api/user/upload-avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: { avatar: File }
```

**Response (200):**
```json
{
  "success": true,
  "avatarUrl": "https://cdn.example.com/avatars/user-789.jpg"
}
```

---

##### PUT `/api/user/status`
Actualizar estado online.

**Types:**
```typescript
interface UpdateStatusRequest {
  online: boolean;
}

interface UpdateStatusResponse {
  success: boolean;
  online: boolean;
}
```

**Request:**
```http
PUT /api/user/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "online": true
}
```

**Response (200):**
```json
{
  "success": true,
  "online": true
}
```

---

##### PUT `/api/user/social-links`
Actualizar redes sociales.

**Types:**
```typescript
interface UpdateSocialLinksRequest {
  x?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  discord?: string;
}

interface UpdateSocialLinksResponse {
  success: boolean;
  socialLinks: {
    x?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    discord?: string;
  };
}
```

**Request:**
```http
PUT /api/user/social-links
Authorization: Bearer <token>
Content-Type: application/json

{
  "x": "https://x.com/johndoe",
  "youtube": "https://youtube.com/@johndoe",
  "twitch": "https://twitch.tv/johndoe"
}
```

**Response (200):**
```json
{
  "success": true,
  "socialLinks": {
    "x": "https://x.com/johndoe",
    "youtube": "https://youtube.com/@johndoe",
    "twitch": "https://twitch.tv/johndoe"
  }
}
```

---

##### GET `/api/user/social-links`
Obtener redes sociales.

**Types:**
```typescript
interface GetSocialLinksResponse {
  x?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  discord?: string;
}
```

---

#### Base de Datos

```sql
-- Agregar columnas a tabla users
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pfp VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS online BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT NOW();

-- Tabla de redes sociales
CREATE TABLE user_social_links (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  x_link VARCHAR(255),
  youtube_link VARCHAR(255),
  instagram_link VARCHAR(255),
  tiktok_link VARCHAR(255),
  discord_link VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🟢 OPCIONAL - Funcionalidades Adicionales

### 7. **Niveles de Streamer**

#### Endpoints

##### GET `/api/streamer/level`
Obtener nivel actual del streamer.

**Types:**
```typescript
interface Level {
  id: number;
  level: string;
  min_followers: number;
  max_followers: number;
  min_hours: number;
  max_hours: number;
}

interface StreamerLevelResponse {
  currentLevel: {
    id: number;
    name: string;
    minFollowers: number;
    maxFollowers: number;
    minHours: number;
    maxHours: number;
  };
  progress: {
    currentHours: number;
    currentFollowers: number;
    hoursProgress: number;      // Porcentaje 0-100
    followersProgress: number;  // Porcentaje 0-100
  };
  nextLevel: {
    id: number;
    name: string;
    minFollowers: number;
    maxFollowers: number;
    minHours: number;
    maxHours: number;
  } | null;
}
```

**Request:**
```http
GET /api/streamer/level
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "currentLevel": {
    "id": 1,
    "name": "Astronauta Novato",
    "minFollowers": 0,
    "maxFollowers": 100,
    "minHours": 0,
    "maxHours": 50
  },
  "progress": {
    "currentHours": 25,
    "currentFollowers": 45,
    "hoursProgress": 50,
    "followersProgress": 45
  },
  "nextLevel": {
    "id": 2,
    "name": "Explorador Planetario",
    "minFollowers": 101,
    "maxFollowers": 500,
    "minHours": 51,
    "maxHours": 150
  }
}
```

---

##### GET `/api/streamer/levels/all`
Obtener todos los niveles disponibles.

**Types:**
```typescript
interface LevelWithRewards extends Level {
  rewards?: string;
}

interface GetAllLevelsResponse {
  levels: LevelWithRewards[];
}
```

**Request:**
```http
GET /api/streamer/levels/all
```

**Response (200):**
```json
{
  "levels": [
    {
      "id": 1,
      "level": "Astronauta Novato",
      "min_followers": 0,
      "max_followers": 100,
      "min_hours": 0,
      "max_hours": 50,
      "rewards": "Badge de Novato"
    },
    {
      "id": 2,
      "level": "Explorador Planetario",
      "min_followers": 101,
      "max_followers": 500,
      "min_hours": 51,
      "max_hours": 150,
      "rewards": "Badge de Explorador + Emote personalizado"
    }
  ]
}
```

---

##### PUT `/api/streamer/hours`
Actualizar horas transmitidas.

**Types:**
```typescript
interface UpdateHoursRequest {
  hours: number;
}

interface UpdateHoursResponse {
  success: boolean;
  newTotal: number;
  levelUp: boolean;
  newLevel: Level | null;
}
```

**Request:**
```http
PUT /api/streamer/hours
Authorization: Bearer <token>
Content-Type: application/json

{
  "hours": 2.5
}
```

**Response (200):**
```json
{
  "success": true,
  "newTotal": 27.5,
  "levelUp": false,
  "newLevel": null
}
```

**Response con Level Up (200):**
```json
{
  "success": true,
  "newTotal": 52,
  "levelUp": true,
  "newLevel": {
    "id": 2,
    "level": "Explorador Planetario",
    "min_followers": 101,
    "max_followers": 500,
    "min_hours": 51,
    "max_hours": 150
  }
}
```

---

##### GET `/api/streamer/stats`
Obtener estadísticas del streamer.

**Types:**
```typescript
interface StreamerStats {
  followers: number;
  streamingHours: number;
  totalViewers: number;
  averageViewers: number;
  peakViewers: number;
  totalStreams: number;
}
```

**Request:**
```http
GET /api/streamer/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "followers": 1250,
  "streamingHours": 320,
  "totalViewers": 15000,
  "averageViewers": 47,
  "peakViewers": 250,
  "totalStreams": 85
}
```

---

#### Base de Datos

```sql
-- Tabla de niveles (cargar desde /public/data/levels.json)
CREATE TABLE streamer_levels (
  id SERIAL PRIMARY KEY,
  level VARCHAR(100) NOT NULL,
  min_followers INTEGER NOT NULL,
  max_followers INTEGER NOT NULL,
  min_hours INTEGER NOT NULL,
  max_hours INTEGER NOT NULL,
  rewards TEXT
);

-- Agregar columnas a users
ALTER TABLE users ADD COLUMN IF NOT EXISTS streaming_hours DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_level_id INTEGER REFERENCES streamer_levels(id);

-- Tabla de estadísticas de streamer
CREATE TABLE streamer_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_streams INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 8. **Sistema de Clips**

#### Endpoints

##### GET `/api/streamer/clips`
Obtener clips del streamer.

**Types:**
```typescript
interface Clip {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  views: number;
  createdAt: Date;
  streamer: {
    id: string;
    name: string;
  };
}

interface GetClipsQuery {
  page?: number;
  limit?: number;
}

interface GetClipsResponse {
  clips: Clip[];
  total: number;
  page: number;
}
```

**Request:**
```http
GET /api/streamer/clips?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "clips": [
    {
      "id": "clip-123",
      "url": "https://cdn.example.com/clips/clip-123.mp4",
      "title": "Jugada épica!",
      "thumbnail": "https://cdn.example.com/thumbnails/clip-123.jpg",
      "views": 1250,
      "createdAt": "2025-11-27T14:30:25.000Z",
      "streamer": {
        "id": "streamer-1",
        "name": "CoolStreamer"
      }
    }
  ],
  "total": 45,
  "page": 1
}
```

---

##### POST `/api/streamer/clips`
Crear nuevo clip.

**Types:**
```typescript
interface CreateClipRequest {
  url: string;
  title: string;
  thumbnail: string;
}

interface CreateClipResponse {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  createdAt: Date;
}
```

**Request:**
```http
POST /api/streamer/clips
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://cdn.example.com/clips/new-clip.mp4",
  "title": "Momento increíble",
  "thumbnail": "https://cdn.example.com/thumbnails/new-clip.jpg"
}
```

**Response (201):**
```json
{
  "id": "clip-456",
  "url": "https://cdn.example.com/clips/new-clip.mp4",
  "title": "Momento increíble",
  "thumbnail": "https://cdn.example.com/thumbnails/new-clip.jpg",
  "createdAt": "2025-11-27T14:30:25.000Z"
}
```

---

##### PUT `/api/streamer/clips/:id`
Actualizar clip.

**Types:**
```typescript
interface UpdateClipRequest {
  title?: string;
  thumbnail?: string;
}

interface UpdateClipResponse {
  success: boolean;
  clip: Clip;
}
```

---

##### DELETE `/api/streamer/clips/:id`
Eliminar clip.

**Types:**
```typescript
interface DeleteClipResponse {
  success: boolean;
  message: string;
}
```

---

##### POST `/api/clips/:id/view`
Registrar visualización de clip.

**Types:**
```typescript
interface ViewClipResponse {
  success: boolean;
  newViewCount: number;
}
```

---

##### GET `/api/clips/trending`
Obtener clips en tendencia.

**Types:**
```typescript
interface GetTrendingClipsQuery {
  limit?: number;
}

interface GetTrendingClipsResponse {
  clips: Clip[];
}
```

**Request:**
```http
GET /api/clips/trending?limit=10
```

**Response (200):**
```json
{
  "clips": [
    {
      "id": "clip-789",
      "url": "https://cdn.example.com/clips/clip-789.mp4",
      "title": "¡Increíble!",
      "thumbnail": "https://cdn.example.com/thumbnails/clip-789.jpg",
      "views": 5000,
      "createdAt": "2025-11-26T10:15:00.000Z",
      "streamer": {
        "id": "streamer-2",
        "name": "ProGamer"
      }
    }
  ]
}
```

---

#### Base de Datos

```sql
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(500),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clips_streamer ON clips(streamer_id, created_at DESC);
CREATE INDEX idx_clips_views ON clips(views DESC, created_at DESC);
```

---

### 9. **Sistema de Amigos**

#### Endpoints

##### GET `/api/user/friends`
Obtener lista de amigos.

**Types:**
```typescript
interface Friend {
  id: string;
  name: string;
  email: string;
  pfp: string;
  online: boolean;
  lastSeen: Date;
}

interface GetFriendsResponse {
  friends: Friend[];
}
```

**Request:**
```http
GET /api/user/friends
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "friends": [
    {
      "id": "user-456",
      "name": "JaneDoe",
      "email": "jane@example.com",
      "pfp": "https://example.com/avatar2.jpg",
      "online": true,
      "lastSeen": "2025-11-27T14:30:25.000Z"
    }
  ]
}
```

---

##### POST `/api/user/friends/request`
Enviar solicitud de amistad.

**Types:**
```typescript
interface SendFriendRequestRequest {
  friendId: string;
}

interface SendFriendRequestResponse {
  success: boolean;
  requestId: string;
}
```

**Request:**
```http
POST /api/user/friends/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "user-999"
}
```

**Response (200):**
```json
{
  "success": true,
  "requestId": "fr-123"
}
```

---

##### GET `/api/user/friends/requests`
Obtener solicitudes de amistad.

**Types:**
```typescript
interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    pfp: string;
  };
  toUser: {
    id: string;
    name: string;
    pfp: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface FriendRequestsResponse {
  received: FriendRequest[];
  sent: FriendRequest[];
}
```

**Request:**
```http
GET /api/user/friends/requests
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "received": [
    {
      "id": "fr-456",
      "fromUser": {
        "id": "user-888",
        "name": "BobSmith",
        "pfp": "https://example.com/avatar3.jpg"
      },
      "toUser": {
        "id": "user-789",
        "name": "JohnDoe",
        "pfp": "https://example.com/avatar.jpg"
      },
      "status": "pending",
      "createdAt": "2025-11-27T14:30:25.000Z"
    }
  ],
  "sent": []
}
```

---

##### POST `/api/user/friends/accept/:requestId`
Aceptar solicitud de amistad.

**Types:**
```typescript
interface AcceptFriendRequestResponse {
  success: boolean;
  friendship: {
    user1: Friend;
    user2: Friend;
  };
}
```

---

##### POST `/api/user/friends/reject/:requestId`
Rechazar solicitud de amistad.

**Types:**
```typescript
interface RejectFriendRequestResponse {
  success: boolean;
  message: string;
}
```

---

##### DELETE `/api/user/friends/:friendId`
Eliminar amigo.

**Types:**
```typescript
interface DeleteFriendResponse {
  success: boolean;
  message: string;
}
```

---

#### Base de Datos

```sql
CREATE TABLE friendships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id < friend_id) -- Evitar duplicados
);

CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friend_requests_to ON friend_requests(to_user_id, status);
CREATE INDEX idx_friend_requests_from ON friend_requests(from_user_id, status);
```

---

### 10. **Sistema de Notificaciones**

#### Endpoints

##### GET `/api/notifications`
Obtener notificaciones del usuario.

**Types:**
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'new_follower' | 'level_up' | 'medal_earned' | 'stream_started';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
}

interface GetNotificationsQuery {
  unread?: boolean;
  page?: number;
  limit?: number;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}
```

**Request:**
```http
GET /api/notifications?unread=true&page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notif-123",
      "userId": "user-789",
      "type": "new_follower",
      "title": "Nuevo seguidor",
      "message": "JaneDoe ahora te sigue",
      "data": {
        "followerId": "user-456",
        "followerName": "JaneDoe"
      },
      "read": false,
      "createdAt": "2025-11-27T14:30:25.000Z"
    }
  ],
  "unreadCount": 5,
  "total": 25
}
```

---

##### PUT `/api/notifications/:id/read`
Marcar notificación como leída.

**Types:**
```typescript
interface MarkAsReadResponse {
  success: boolean;
}
```

---

##### PUT `/api/notifications/read-all`
Marcar todas como leídas.

**Types:**
```typescript
interface MarkAllAsReadResponse {
  success: boolean;
  count: number;
}
```

---

##### DELETE `/api/notifications/:id`
Eliminar notificación.

**Types:**
```typescript
interface DeleteNotificationResponse {
  success: boolean;
}
```

---

##### WebSocket `/api/notifications`
Notificaciones en tiempo real.

**Types:**
```typescript
interface NotificationEvents {
  new_notification: Notification;
}
```

---

#### Base de Datos

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read, created_at DESC);
```

---

## 📊 Resumen de Endpoints Pendientes

| Categoría | Endpoints | WebSockets |
|-----------|-----------|------------|
| **Chat** | 3 | 1 |
| **Viewers** | 4 | 1 |
| **Pagos** | 3 | 0 |
| **Puntos** | 4 | 0 |
| **Medallas** | 6 | 0 |
| **Perfil** | 6 | 0 |
| **Niveles** | 4 | 0 |
| **Clips** | 6 | 0 |
| **Amigos** | 6 | 0 |
| **Notificaciones** | 4 | 1 |
| **TOTAL** | **46** | **3** |

---

**Última actualización:** Noviembre 27, 2025  
**Documento:** Especificación completa con TypeScript types  
**Estado:** Listo para implementación en backend
