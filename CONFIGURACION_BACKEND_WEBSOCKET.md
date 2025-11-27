# Configuración del Backend WebSocket

**Última actualización:** 27 de noviembre, 2025

---

## 🎯 Objetivo

Configurar el backend para que el chat funcione en tiempo real con Socket.IO.

---

## 📋 Requisitos del Backend

### 1. Instalar Socket.IO en el Backend

```bash
npm install socket.io
npm install --save-dev @types/socket.io
```

### 2. Configurar Socket.IO en el Servidor

```typescript
// server.ts o app.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL del frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware de autenticación
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Namespace para chat
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.data.userId);
  
  const streamId = socket.handshake.query.streamId as string;
  
  // Unirse a la sala del stream
  socket.join(`stream-${streamId}`);
  
  // Notificar a otros usuarios
  socket.to(`stream-${streamId}`).emit('user_joined', {
    userId: socket.data.userId,
    userName: socket.data.userName
  });

  // Escuchar mensajes
  socket.on('send_message', async (data) => {
    try {
      const { texto } = data;
      
      // Guardar mensaje en la base de datos
      const message = await prisma.chatMessage.create({
        data: {
          streamId,
          userId: socket.data.userId,
          texto,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              pfp: true
            }
          }
        }
      });

      // Otorgar puntos al usuario
      await prisma.userPoints.upsert({
        where: {
          userId_streamerId: {
            userId: socket.data.userId,
            streamerId: streamId
          }
        },
        update: {
          points: { increment: 1 }
        },
        create: {
          userId: socket.data.userId,
          streamerId: streamId,
          points: 1
        }
      });

      // Crear hora formateada
      const now = new Date();
      const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Emitir mensaje a todos en la sala
      io.to(`stream-${streamId}`).emit('new_message', {
        message: {
          id: message.id,
          streamId: message.streamId,
          userId: message.userId,
          texto: message.texto,
          hora,
          user: message.user,
          createdAt: message.createdAt
        },
        pointsEarned: 1
      });

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('error', { message: 'Error al enviar mensaje' });
    }
  });

  // Indicador de escritura
  socket.on('typing', (data) => {
    socket.to(`stream-${streamId}`).emit('typing', {
      userId: socket.data.userId,
      userName: socket.data.userName,
      isTyping: data.isTyping
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.data.userId);
    socket.to(`stream-${streamId}`).emit('user_left', {
      userId: socket.data.userId,
      userName: socket.data.userName
    });
  });
});

// Iniciar servidor
httpServer.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
  console.log('WebSocket listo en ws://localhost:8080');
});
```

---

## 🗄️ Base de Datos

### Tabla de Mensajes de Chat

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
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
```

### Prisma Schema

```prisma
model ChatMessage {
  id        String   @id @default(uuid())
  streamId  String   @map("stream_id")
  userId    String   @map("user_id")
  texto     String
  createdAt DateTime @default(now()) @map("created_at")
  deleted   Boolean  @default(false)

  stream Stream @relation(fields: [streamId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([streamId, createdAt(sort: Desc)])
  @@index([userId])
  @@map("chat_messages")
}
```

---

## 🔧 Configuración del Frontend

El frontend ya está configurado para conectarse a `http://localhost:8080` con Socket.IO.

### Verificar Configuración

1. **URL del backend:** `http://localhost:8080`
2. **Path de Socket.IO:** `/socket.io` (default)
3. **Autenticación:** JWT token desde localStorage
4. **Namespace:** Raíz (`/`)

---

## 🧪 Cómo Probar

### 1. Iniciar el Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
Servidor corriendo en http://localhost:8080
WebSocket listo en ws://localhost:8080
```

### 2. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

### 3. Probar el Chat

1. Inicia sesión con un usuario
2. Ve a un stream
3. Abre la consola del navegador
4. Deberías ver:
   ```
   Conectando a WebSocket: http://localhost:8080
   Stream ID: 1
   Token: Presente
   Conectado al chat del stream: 1
   ```
5. Escribe un mensaje
6. Deberías ver:
   ```
   Mensaje enviado por WebSocket: Hola!
   Nuevo mensaje recibido: {...}
   ```

---

## 🐛 Troubleshooting

### Error: "WebSocket no disponible"

**Causa:** El backend no está corriendo o no tiene Socket.IO configurado.

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Verifica que Socket.IO esté instalado
3. Revisa los logs del backend

### Error: "Authentication error"

**Causa:** El token JWT no es válido o no se está enviando.

**Solución:**
1. Verifica que el usuario esté logueado
2. Verifica que el token esté en localStorage (`auth_token`)
3. Verifica que el backend esté validando el token correctamente

### Error: "CORS"

**Causa:** El backend no permite conexiones desde el frontend.

**Solución:**
Agregar configuración CORS en Socket.IO:
```typescript
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

### Los mensajes no aparecen

**Causa:** El evento `new_message` no se está emitiendo correctamente.

**Solución:**
1. Verifica que el backend esté emitiendo `new_message`
2. Verifica que el frontend esté escuchando `new_message`
3. Revisa la consola del navegador y del backend

---

## 📊 Eventos de Socket.IO

### Del Cliente al Servidor

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `send_message` | `{ texto: string }` | Enviar mensaje al chat |
| `typing` | `{ isTyping: boolean }` | Indicar que está escribiendo |

### Del Servidor al Cliente

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `new_message` | `{ message: ChatMessage, pointsEarned: number }` | Nuevo mensaje en el chat |
| `user_joined` | `{ userId: string, userName: string }` | Usuario se unió al chat |
| `user_left` | `{ userId: string, userName: string }` | Usuario salió del chat |
| `typing` | `{ userId: string, userName: string, isTyping: boolean }` | Usuario está escribiendo |
| `error` | `{ message: string }` | Error en el servidor |

---

## ✅ Checklist de Configuración

### Backend
- [ ] Socket.IO instalado
- [ ] Servidor HTTP creado
- [ ] Socket.IO configurado con CORS
- [ ] Middleware de autenticación JWT
- [ ] Handler de `send_message`
- [ ] Handler de `typing`
- [ ] Emisión de `new_message`
- [ ] Tabla `chat_messages` creada
- [ ] Sistema de puntos funcionando

### Frontend
- [ ] socket.io-client instalado
- [ ] chat.service.ts configurado
- [ ] ChatBar actualizado
- [ ] ChatSection actualizado
- [ ] Token en localStorage

### Testing
- [ ] Backend corriendo en puerto 8080
- [ ] Frontend corriendo en puerto 5173
- [ ] Usuario logueado
- [ ] WebSocket conectado
- [ ] Mensajes enviándose
- [ ] Mensajes recibiéndose
- [ ] Puntos sumándose

---

## 🚀 Estado Actual

**Frontend:** ✅ Listo y configurado
**Backend:** ⏳ Pendiente de configuración

Una vez que el backend esté configurado con Socket.IO, el chat funcionará en tiempo real automáticamente.

---

## 📝 Notas Importantes

1. El frontend ya tiene **modo fallback local** que funciona sin WebSocket
2. Los mensajes se mostrarán localmente hasta que el backend esté listo
3. Una vez conectado el WebSocket, los mensajes se sincronizarán en tiempo real
4. Los puntos se calcularán automáticamente en el backend

**Próximo paso:** Configurar Socket.IO en el backend siguiendo esta guía.
