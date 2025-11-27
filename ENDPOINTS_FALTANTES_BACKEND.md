# Endpoints Faltantes en el Backend

**Última actualización:** 27 de noviembre, 2025

---

## Estado de Componentes Frontend

### ✅ Componentes Ya Implementados Visualmente
- `ChatBar.tsx` - Input de chat (sin conexión backend)
- `ChatMessage.tsx` - Mensaje de chat
- `ChatSection.tsx` - Sección completa de chat
- `PointsBar.tsx` - Barra de puntos (datos estáticos)
- `GiftsManager.tsx` - Gestor de regalos (conectado a backend)
- `NotificacionNivel.tsx` - Notificación de nivel
- `ProgressBar.tsx` - Barra de progreso
- `AllFeaturesDemo.tsx` - Demo de todas las funcionalidades

### ❌ Componentes que Necesitan Conexión Backend
- Chat en tiempo real
- Sistema de puntos
- Sistema de medallas
- Notificaciones
- Clips
- Amigos
- Niveles de streamer

---

## 🔴 CRÍTICO - Endpoints Pendientes

### 1. Chat en Tiempo Real

#### POST `/api/chat/send`
Enviar mensaje al chat.

**Request:**
```typescript
interface SendMessageRequest {
  streamId: string;
  texto: string;
}
```

**Response:**
```typescript
interface SendMessageResponse {
  message: {
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
  };
  pointsEarned: number;
}
```

**Base de Datos:**
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_chat_messages_stream ON chat_messages(stream_id, created_at DESC);
```

---

#### GET `/api/chat/messages/:streamId`
Obtener historial de mensajes.

**Query Params:**
- `limit` (opcional): número de mensajes (default: 50)
- `offset` (opcional): offset para paginación (default: 0)

**Response:**
```typescript
interface GetMessagesResponse {
  messages: ChatMessage[];
  total: number;
}
```

---

#### DELETE `/api/chat/message/:messageId`
Eliminar mensaje (solo moderadores/streamer).

**Response:**
```typescript
interface DeleteMessageResponse {
  success: boolean;
  message: string;
}
```

---

#### WebSocket `/ws/chat/:streamId`
Conexión en tiempo real para chat.

**Eventos del servidor:**
```typescript
interface ChatEvents {
  new_message: ChatMessage;
  user_joined: { userId: string; userName: string; };
  user_left: { userId: string; userName: string; };
  message_deleted: { messageId: string; };
}
```

**Eventos del cliente:**
```typescript
interface ChatClientEvents {
  send_message: { texto: string; };
  typing: { isTyping: boolean; };
}
```

---

### 2. Viewers en Vivo

#### POST `/api/viewers/join/:streamId`
Unirse a un stream.

**Response:**
```typescript
interface JoinStreamResponse {
  success: boolean;
  currentViewers: number;
  viewersList: Array<{
    id: string;
    name: string;
    pfp: string;
    joinedAt: Date;
  }>;
}
```

**Base de Datos:**
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
```

---

#### POST `/api/viewers/leave/:streamId`
Salir de un stream.

**Response:**
```typescript
interface LeaveStreamResponse {
  success: boolean;
  currentViewers: number;
}
```

---

#### GET `/api/viewers/:streamId`
Obtener lista de viewers actuales.

**Response:**
```typescript
interface GetViewersResponse {
  viewers: ActiveViewer[];
  count: number;
}
```

---

#### POST `/api/viewers/heartbeat/:streamId`
Mantener conexión activa (llamar cada 30 segundos).

**Response:**
```typescript
interface HeartbeatResponse {
  success: boolean;
}
```

---

#### WebSocket `/ws/viewers/:streamId`
Actualizaciones en tiempo real de viewers.

**Eventos:**
```typescript
interface ViewerEvents {
  viewer_joined: { viewer: ActiveViewer; newCount: number; };
  viewer_left: { viewerId: string; newCount: number; };
  viewer_count_update: { count: number; };
}
```

---

### 3. Confirmación de Pagos

#### POST `/api/payment/webhook`
Webhook de Stripe para confirmar pagos.

**Request (desde Stripe):**
```typescript
interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      metadata: {
        userId: string;
        packId: string;
      };
    };
  };
}
```

**Response:**
```typescript
interface WebhookResponse {
  received: boolean;
}
```

**Base de Datos:**
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
  completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_stripe_session ON transactions(stripe_session_id);
```

---

#### GET `/api/payment/transaction-history`
Historial de transacciones del usuario.

**Query Params:**
- `page` (opcional): página (default: 1)
- `limit` (opcional): items por página (default: 10)
- `status` (opcional): filtrar por estado

**Response:**
```typescript
interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
```

---

#### GET `/api/payment/balance`
Balance actual de monedas.

**Response:**
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

---

## 🟡 IMPORTANTE - Endpoints de Engagement

### 4. Sistema de Puntos

#### GET `/api/points`
Obtener puntos del usuario.

**Response:**
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

**Base de Datos:**
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
CREATE INDEX idx_points_history_user ON points_history(user_id, created_at DESC);
```

---

#### POST `/api/points/earn`
Ganar puntos por acción.

**Request:**
```typescript
interface EarnPointsRequest {
  streamerId: string;
  action: 'message_sent' | 'watch_time' | 'subscription' | 'donation';
  amount: number;
}
```

**Response:**
```typescript
interface EarnPointsResponse {
  success: boolean;
  pointsEarned: number;
  newTotal: number;
}
```

---

#### POST `/api/points/send`
Enviar puntos a un streamer.

**Request:**
```typescript
interface SendPointsRequest {
  streamerId: string;
  points: number;
}
```

**Response:**
```typescript
interface SendPointsResponse {
  success: boolean;
  newBalance: number;
  streamerReceived: number;
}
```

---

#### GET `/api/points/history`
Historial de puntos.

**Query Params:**
- `streamerId` (opcional): filtrar por streamer
- `page` (opcional): página
- `limit` (opcional): items por página

**Response:**
```typescript
interface PointsHistoryResponse {
  history: Array<{
    id: string;
    streamerId: string;
    streamerName: string;
    action: string;
    points: number;
    createdAt: Date;
  }>;
  total: number;
  page: number;
}
```

---

### 5. Sistema de Medallas

#### GET `/api/medals`
Obtener medallas del usuario.

**Response:**
```typescript
interface GetUserMedalsResponse {
  medals: Array<{
    id: string;
    level: string;
    name: string;
    description: string;
    earnedDate: Date;
    streamer: {
      id: string;
      name: string;
    };
  }>;
  total: number;
}
```

**Base de Datos:**
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
```

---

#### GET `/api/medals/available`
Medallas disponibles del streamer actual.

**Response:**
```typescript
interface GetAvailableMedalsResponse {
  medals: Array<{
    id: string;
    level: string;
    name: string;
    description: string;
    minMessages: number;
    minPoints: number;
  }>;
}
```

---

#### POST `/api/medals/create`
Crear nueva medalla (solo streamers).

**Request:**
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
```

**Response:**
```typescript
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

---

#### PUT `/api/medals/:id`
Actualizar medalla.

**Request:**
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
```

---

#### DELETE `/api/medals/:id`
Eliminar medalla.

---

#### POST `/api/medals/award`
Otorgar medalla a un usuario.

**Request:**
```typescript
interface AwardMedalRequest {
  userId: string;
  medalId: string;
}
```

---

### 6. Niveles de Streamer

#### GET `/api/streamer/level`
Obtener nivel actual del streamer.

**Response:**
```typescript
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
    hoursProgress: number;
    followersProgress: number;
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

**Base de Datos:**
```sql
-- Usar datos de /public/data/levels.json
-- Agregar columna a users:
ALTER TABLE users ADD COLUMN IF NOT EXISTS streaming_hours DECIMAL(10, 2) DEFAULT 0;
```

---

#### GET `/api/streamer/levels/all`
Obtener todos los niveles disponibles.

**Response:**
```typescript
interface GetAllLevelsResponse {
  levels: Array<{
    id: number;
    level: string;
    min_followers: number;
    max_followers: number;
    min_hours: number;
    max_hours: number;
  }>;
}
```

---

#### PUT `/api/streamer/hours`
Actualizar horas transmitidas.

**Request:**
```typescript
interface UpdateHoursRequest {
  hours: number;
}
```

**Response:**
```typescript
interface UpdateHoursResponse {
  success: boolean;
  newTotal: number;
  levelUp: boolean;
  newLevel: Level | null;
}
```

---

#### GET `/api/streamer/stats`
Estadísticas del streamer.

**Response:**
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

---

## 🟢 OPCIONAL - Endpoints Adicionales

### 7. Notificaciones

#### GET `/api/notifications`
Obtener notificaciones del usuario.

**Response:**
```typescript
interface GetNotificationsResponse {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
  }>;
  unreadCount: number;
}
```

**Base de Datos:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read);
```

---

#### PUT `/api/notifications/:id/read`
Marcar notificación como leída.

---

#### DELETE `/api/notifications/:id`
Eliminar notificación.

---

### 8. Clips

#### GET `/api/clips`
Obtener clips del usuario.

**Response:**
```typescript
interface GetClipsResponse {
  clips: Array<{
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    duration: number;
    views: number;
    createdAt: Date;
  }>;
}
```

**Base de Datos:**
```sql
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(500),
  url VARCHAR(500) NOT NULL,
  duration INTEGER NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clips_user ON clips(user_id, created_at DESC);
```

---

#### POST `/api/clips/create`
Crear nuevo clip.

**Request:**
```typescript
interface CreateClipRequest {
  streamId: string;
  title: string;
  startTime: number;
  duration: number;
}
```

---

#### DELETE `/api/clips/:id`
Eliminar clip.

---

### 9. Amigos

#### GET `/api/friends`
Obtener lista de amigos.

**Response:**
```typescript
interface GetFriendsResponse {
  friends: Array<{
    id: string;
    name: string;
    pfp: string;
    online: boolean;
  }>;
}
```

**Base de Datos:**
```sql
CREATE TABLE friendships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  PRIMARY KEY (user_id, friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

---

#### GET `/api/friends/requests`
Obtener solicitudes de amistad.

**Response:**
```typescript
interface GetFriendRequestsResponse {
  received: Array<{
    id: string;
    name: string;
    pfp: string;
    requestedAt: Date;
  }>;
  sent: Array<{
    id: string;
    name: string;
    pfp: string;
    requestedAt: Date;
  }>;
}
```

---

#### POST `/api/friends/request`
Enviar solicitud de amistad.

**Request:**
```typescript
interface SendFriendRequestRequest {
  friendId: string;
}
```

---

#### PUT `/api/friends/accept/:friendId`
Aceptar solicitud de amistad.

---

#### DELETE `/api/friends/:friendId`
Eliminar amigo o rechazar solicitud.

---

## 📊 Resumen de Endpoints Pendientes

| Categoría | Endpoints | Prioridad |
|-----------|-----------|-----------|
| **Chat** | 4 endpoints + WebSocket | 🔴 CRÍTICO |
| **Viewers** | 4 endpoints + WebSocket | 🔴 CRÍTICO |
| **Pagos** | 3 endpoints | 🔴 CRÍTICO |
| **Puntos** | 4 endpoints | 🟡 IMPORTANTE |
| **Medallas** | 6 endpoints | 🟡 IMPORTANTE |
| **Niveles** | 4 endpoints | 🟡 IMPORTANTE |
| **Notificaciones** | 3 endpoints | 🟢 OPCIONAL |
| **Clips** | 3 endpoints | 🟢 OPCIONAL |
| **Amigos** | 5 endpoints | 🟢 OPCIONAL |

**Total:** 36 endpoints + 2 WebSockets

---

## 🎯 Orden de Implementación Recomendado

### Fase 1: Funcionalidades Core (2-3 semanas)
1. Chat en tiempo real (4 endpoints + WebSocket)
2. Viewers en vivo (4 endpoints + WebSocket)
3. Confirmación de pagos (3 endpoints)

### Fase 2: Engagement (1-2 semanas)
4. Sistema de puntos (4 endpoints)
5. Sistema de medallas (6 endpoints)
6. Niveles de streamer (4 endpoints)

### Fase 3: Opcionales (1-2 semanas)
7. Notificaciones (3 endpoints)
8. Clips (3 endpoints)
9. Amigos (5 endpoints)

---

## 🔧 Tecnologías Necesarias

### WebSocket
- **Socket.io** para chat y viewers en tiempo real
- Eventos bidireccionales
- Rooms por stream

### Base de Datos
- **PostgreSQL** con Prisma
- Índices para optimización
- Triggers para auto-limpieza

### Stripe
- Webhooks para confirmación de pagos
- Metadata para asociar compras

### Autenticación
- JWT en headers
- Middleware de autenticación
- Verificación de roles (streamer/viewer)

---

**Estado:** Pendiente de Implementación
**Componentes Frontend:** Listos y esperando conexión
**Estimación Total:** 4-7 semanas de desarrollo backend
