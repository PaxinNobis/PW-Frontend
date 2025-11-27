# Integración Frontend Pendiente

**Última actualización:** 27 de noviembre, 2025

---

## 🎯 Estado Actual del Proyecto

### ✅ Backend: 95% Completo
- Todos los endpoints principales implementados
- WebSocket para chat y viewers funcionando
- Sistema de puntos, medallas y niveles listo
- Stripe integrado con webhooks
- Autenticación con JWT

### ⏳ Frontend: 60% Completo
- Componentes visuales creados
- Servicios básicos implementados
- Falta conectar con endpoints del backend
- Falta integración de WebSocket

---

## 🔴 CRÍTICO - Integraciones Pendientes

### 1. Chat en Tiempo Real

#### Estado Actual
- ✅ `ChatBar.tsx` - Componente visual listo
- ✅ `ChatMessage.tsx` - Componente visual listo
- ✅ `ChatSection.tsx` - Sección completa lista
- ✅ Backend WebSocket funcionando
- ❌ Integración WebSocket en frontend

#### Tareas Pendientes

**A. Crear servicio de WebSocket para chat**

```typescript
// src/services/chat.service.ts
import io, { Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

let socket: Socket | null = null;

export const connectToChat = (streamId: string, token: string) => {
  socket = io(`${API_CONFIG.BASE_URL}/chat`, {
    auth: { token },
    query: { streamId }
  });

  return socket;
};

export const disconnectFromChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (texto: string) => {
  if (socket) {
    socket.emit('send_message', { texto });
  }
};

export const onNewMessage = (callback: (message: any) => void) => {
  if (socket) {
    socket.on('new_message', callback);
  }
};
```

**B. Actualizar ChatBar.tsx para usar WebSocket**

```typescript
// Modificar handleChat en ChatBar.tsx
const handleChat = () => {
  if (!user || !TextChat) return;
  
  // Enviar mensaje por WebSocket
  sendMessage(TextChat);
  SetTextChat(""); // Limpiar input
};
```

**C. Actualizar ChatSection.tsx para recibir mensajes**

```typescript
// Agregar en ChatSection.tsx
useEffect(() => {
  const socket = connectToChat(props.stream.id, getToken());
  
  onNewMessage((message) => {
    // Agregar mensaje a la lista
    props.stream.messagelist.push(message);
  });

  return () => {
    disconnectFromChat();
  };
}, [props.stream.id]);
```

**Estimación:** 4-6 horas

---

### 2. Sistema de Puntos en Chat

#### Estado Actual
- ✅ `PointsBar.tsx` - Componente visual listo
- ✅ Backend calcula puntos automáticamente
- ❌ Frontend no muestra puntos actualizados

#### Tareas Pendientes

**A. Actualizar PointsBar.tsx para mostrar puntos reales**

```typescript
// src/components/StreamingComponents/PointsBar.tsx
import { usePoints } from '../../hooks/useNewFeatures';

const PointsBar = ({ streamerId }: { streamerId: string }) => {
  const { points, loading } = usePoints();
  
  // Encontrar puntos del streamer actual
  const streamerPoints = points?.byStreamer.find(
    s => s.streamerId === streamerId
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="d-flex align-items-center">
      <i className="bi bi-star-fill text-warning me-2"></i>
      <span className="fw-bold">{streamerPoints?.points || 0} pts</span>
    </div>
  );
};
```

**B. Actualizar puntos cuando se envía mensaje**

```typescript
// En ChatBar.tsx, después de enviar mensaje
onNewMessage((message) => {
  if (message.pointsEarned) {
    // Actualizar puntos localmente
    console.log(`Ganaste ${message.pointsEarned} puntos!`);
  }
});
```

**Estimación:** 2-3 horas

---

### 3. Viewers en Tiempo Real

#### Estado Actual
- ✅ Backend WebSocket para viewers funcionando
- ❌ Frontend no muestra viewers en tiempo real

#### Tareas Pendientes

**A. Crear componente ViewersCount**

```typescript
// src/components/StreamingComponents/ViewersCount.tsx
import { useViewers } from '../../hooks/useNewFeatures';

interface ViewersCountProps {
  streamId: string;
}

const ViewersCount = ({ streamId }: ViewersCountProps) => {
  const { viewerCount, viewers, loading } = useViewers(streamId);

  if (loading) return <div>...</div>;

  return (
    <div className="viewers-count">
      <i className="bi bi-eye-fill me-2"></i>
      <span className="fw-bold">{viewerCount}</span>
      
      {/* Lista de viewers */}
      <div className="viewers-list">
        {viewers.slice(0, 10).map(viewer => (
          <div key={viewer.id} className="viewer-item">
            <img src={viewer.pfp} alt={viewer.name} width="24" />
            <span>{viewer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**B. Integrar en StreamingSection**

```typescript
// En StreamingSection.tsx
<ViewersCount streamId={stream.id} />
```

**C. Implementar join/leave automático**

```typescript
// En StreamingSection.tsx useEffect
useEffect(() => {
  const { joinStream, leaveStream } = viewerService;
  
  joinStream(streamId);
  
  return () => {
    leaveStream(streamId);
  };
}, [streamId]);
```

**Estimación:** 3-4 horas

---

### 4. Confirmación de Pagos

#### Estado Actual
- ✅ Stripe checkout funcionando
- ✅ Webhook del backend procesando pagos
- ❌ Frontend no muestra confirmación

#### Tareas Pendientes

**A. Crear página de confirmación**

```typescript
// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Verificar el pago y obtener nuevo balance
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?session_id=${sessionId}`);
        const data = await response.json();
        setCoins(data.newBalance);
      } catch (error) {
        console.error('Error verificando pago:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  if (loading) {
    return <div>Verificando pago...</div>;
  }

  return (
    <div className="container text-center my-5">
      <i className="bi bi-check-circle text-success" style={{ fontSize: '5rem' }}></i>
      <h1 className="mt-4">¡Pago Exitoso!</h1>
      <p className="lead">Tu saldo actual es: {coins} monedas</p>
      <a href="/" className="btn btn-primary">Volver al inicio</a>
    </div>
  );
};
```

**B. Agregar ruta en AppRouter**

```typescript
// En AppRouter.tsx
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/cancel" element={<PaymentCancel />} />
```

**Estimación:** 2-3 horas

---

## 🟡 IMPORTANTE - Integraciones Pendientes

### 5. Sistema de Medallas

#### Estado Actual
- ✅ Backend con endpoints de medallas
- ✅ Hook `useMedals` creado
- ❌ No hay componente para mostrar medallas

#### Tareas Pendientes

**A. Crear componente MedalsList**

```typescript
// src/components/ProfileComponents/MedalsList.tsx
import { useMedals } from '../../hooks/useNewFeatures';

const MedalsList = () => {
  const { medals, loading } = useMedals();

  if (loading) return <div>Cargando medallas...</div>;

  return (
    <div className="medals-grid">
      <h3>Medallas ({medals.length})</h3>
      <div className="row">
        {medals.map(medal => (
          <div key={medal.id} className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="medal-icon">🏅</div>
                <h6>{medal.name}</h6>
                <small className="text-muted">{medal.level}</small>
                <p className="small">{medal.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**B. Integrar en Profile.tsx**

```typescript
// En Profile.tsx
<MedalsList />
```

**Estimación:** 2-3 horas

---

### 6. Niveles de Streamer

#### Estado Actual
- ✅ Backend con endpoints de niveles
- ✅ Hook `useStreamerLevel` creado
- ❌ No hay componente para mostrar progreso

#### Tareas Pendientes

**A. Crear componente StreamerLevelProgress**

```typescript
// src/components/ProfileComponents/StreamerLevelProgress.tsx
import { useStreamerLevel } from '../../hooks/useNewFeatures';

const StreamerLevelProgress = () => {
  const { levelData, loading } = useStreamerLevel();

  if (loading) return <div>Cargando nivel...</div>;
  if (!levelData) return null;

  return (
    <div className="level-progress">
      <h3>Nivel: {levelData.currentLevel.name}</h3>
      
      {/* Progreso de horas */}
      <div className="mb-3">
        <label>Horas: {levelData.progress.currentHours} / {levelData.currentLevel.maxHours}</label>
        <div className="progress">
          <div 
            className="progress-bar bg-primary" 
            style={{ width: `${levelData.progress.hoursProgress}%` }}
          >
            {levelData.progress.hoursProgress}%
          </div>
        </div>
      </div>

      {/* Progreso de seguidores */}
      <div className="mb-3">
        <label>Seguidores: {levelData.progress.currentFollowers} / {levelData.currentLevel.maxFollowers}</label>
        <div className="progress">
          <div 
            className="progress-bar bg-success" 
            style={{ width: `${levelData.progress.followersProgress}%` }}
          >
            {levelData.progress.followersProgress}%
          </div>
        </div>
      </div>

      {levelData.nextLevel && (
        <div className="alert alert-info">
          Siguiente nivel: {levelData.nextLevel.name}
        </div>
      )}
    </div>
  );
};
```

**B. Integrar en Profile.tsx para streamers**

**Estimación:** 2-3 horas

---

### 7. Notificaciones

#### Estado Actual
- ✅ Backend con endpoints de notificaciones
- ✅ Hook `useNotifications` creado
- ❌ No hay componente de notificaciones

#### Tareas Pendientes

**A. Crear componente NotificationBell**

```typescript
// src/components/NavBarComponents/NotificationBell.tsx
import { useNotifications } from '../../hooks/useNewFeatures';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="dropdown">
      <button 
        className="btn btn-link position-relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="bi bi-bell-fill"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="dropdown-menu show">
          {notifications.slice(0, 5).map(notif => (
            <div 
              key={notif.id} 
              className={`dropdown-item ${!notif.read ? 'bg-light' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <strong>{notif.title}</strong>
              <p className="mb-0 small">{notif.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**B. Integrar en NavBar**

**Estimación:** 2-3 horas

---

## 🟢 OPCIONAL - Integraciones Pendientes

### 8. Clips

#### Tareas
- Crear componente ClipsList
- Integrar en perfil
- Botón para crear clip

**Estimación:** 3-4 horas

---

### 9. Sistema de Amigos

#### Tareas
- Crear componente FriendsList
- Botón para agregar amigos
- Gestión de solicitudes

**Estimación:** 4-5 horas

---

## 📋 Checklist de Integración

### Chat y Viewers
- [ ] Servicio WebSocket de chat
- [ ] Integrar WebSocket en ChatBar
- [ ] Integrar WebSocket en ChatSection
- [ ] Componente ViewersCount
- [ ] Join/Leave automático de viewers
- [ ] Actualizar puntos en tiempo real

### Pagos
- [ ] Página PaymentSuccess
- [ ] Página PaymentCancel
- [ ] Actualizar balance después de pago
- [ ] Mostrar historial de transacciones

### Engagement
- [ ] Componente MedalsList
- [ ] Componente StreamerLevelProgress
- [ ] Componente NotificationBell
- [ ] Integrar en Profile
- [ ] Integrar en NavBar

### Opcionales
- [ ] Componente ClipsList
- [ ] Componente FriendsList
- [ ] Gestión de solicitudes de amistad

---

## 🎯 Plan de Implementación

### Semana 1: Funcionalidades Críticas (20-25 horas)
**Día 1-2:** Chat en tiempo real (8 horas)
- WebSocket service
- Integración en ChatBar y ChatSection
- Sistema de puntos en tiempo real

**Día 3:** Viewers en vivo (4 horas)
- Componente ViewersCount
- Join/Leave automático

**Día 4:** Confirmación de pagos (4 horas)
- Páginas de éxito/cancelación
- Actualización de balance

**Día 5:** Testing y ajustes (4 horas)

### Semana 2: Engagement (15-20 horas)
**Día 1:** Medallas (3 horas)
- Componente MedalsList
- Integración en perfil

**Día 2:** Niveles (3 horas)
- Componente StreamerLevelProgress
- Barras de progreso

**Día 3:** Notificaciones (3 horas)
- Componente NotificationBell
- Integración en NavBar

**Día 4-5:** Opcionales (6 horas)
- Clips
- Amigos

---

## 🔧 Dependencias Necesarias

### Instalar Socket.io Client
```bash
npm install socket.io-client
```

### Tipos de TypeScript
```bash
npm install --save-dev @types/socket.io-client
```

---

## 📊 Estimación Total

| Categoría | Horas | Prioridad |
|-----------|-------|-----------|
| Chat en tiempo real | 6-8h | 🔴 CRÍTICO |
| Viewers en vivo | 3-4h | 🔴 CRÍTICO |
| Confirmación de pagos | 2-3h | 🔴 CRÍTICO |
| Sistema de puntos | 2-3h | 🔴 CRÍTICO |
| Medallas | 2-3h | 🟡 IMPORTANTE |
| Niveles | 2-3h | 🟡 IMPORTANTE |
| Notificaciones | 2-3h | 🟡 IMPORTANTE |
| Clips | 3-4h | 🟢 OPCIONAL |
| Amigos | 4-5h | 🟢 OPCIONAL |

**Total Crítico:** 13-18 horas
**Total Importante:** 6-9 horas
**Total Opcional:** 7-9 horas

**TOTAL GENERAL:** 26-36 horas (3-5 días de trabajo)

---

## ✅ Resultado Final

Al completar estas integraciones:
- ✅ Chat en tiempo real funcionando
- ✅ Viewers actualizándose en vivo
- ✅ Pagos confirmados automáticamente
- ✅ Puntos ganándose por mensajes
- ✅ Medallas mostrándose en perfil
- ✅ Niveles con barras de progreso
- ✅ Notificaciones en tiempo real
- ✅ Sistema completo y funcional

**Estado Final:** 100% Funcional y Listo para Producción 🚀
