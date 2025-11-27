# Resumen: Chat con WebSocket Nativo

**Última actualización:** 27 de noviembre, 2025

---

## ✅ Estado Actual

El frontend está **completamente configurado** para usar WebSocket nativo y se conecta correctamente a `ws://localhost:8080`.

---

## 🔧 Configuración del Frontend

### Servicio de Chat (`chat.service.ts`)

**Conexión:**
```typescript
const wsUrl = 'ws://localhost:8080';
const socket = new WebSocket(wsUrl);
```

**Autenticación al conectar:**
```json
{
  "type": "auth",
  "token": "jwt-token-aqui"
}
```

**Envío de mensajes:**
```json
{
  "type": "chat_message",
  "streamId": "1",
  "message": "Hola!"
}
```

**Indicador de escritura:**
```json
{
  "type": "typing",
  "streamId": "1",
  "isTyping": true
}
```

---

## 📊 Mensajes que el Frontend Espera Recibir

### 1. Autenticación Exitosa
```json
{
  "type": "auth_success"
}
```

### 2. Nuevo Mensaje
```json
{
  "type": "new_message",
  "message": {
    "id": "msg-123",
    "streamId": "1",
    "userId": "user-456",
    "texto": "Hola!",
    "hora": "14:30",
    "user": {
      "id": "user-456",
      "name": "Usuario",
      "pfp": "https://..."
    },
    "createdAt": "2025-11-27T14:30:00.000Z"
  },
  "pointsEarned": 1
}
```

### 3. Usuario se Unió
```json
{
  "type": "user_joined",
  "userId": "user-789",
  "userName": "NuevoUsuario"
}
```

### 4. Usuario se Fue
```json
{
  "type": "user_left",
  "userId": "user-789",
  "userName": "Usuario"
}
```

### 5. Error
```json
{
  "type": "error",
  "message": "Descripción del error"
}
```

---

## 🐛 Error Actual

### Mensaje del Backend:
```json
{
  "type": "error",
  "message": "Tipo de mensaje desconocido"
}
```

### Causa:
El backend no reconoce el tipo `'auth'` que estamos enviando.

### Posibles Soluciones:

#### Opción 1: El backend espera otro tipo de autenticación
Pregunta al desarrollador del backend:
- ¿Qué tipo de mensaje espera para autenticación?
- ¿Debería ser `'auth'`, `'authenticate'`, `'login'`, etc.?

#### Opción 2: La autenticación se hace de otra forma
Tal vez el backend espera:
- Token en la URL: `ws://localhost:8080?token=...`
- Token en headers (no soportado en WebSocket del navegador)
- Autenticación HTTP antes de WebSocket

#### Opción 3: No requiere autenticación inicial
Tal vez el backend solo valida el token cuando envías mensajes.

---

## 🔍 Debugging

### Logs del Frontend
Cuando te conectas, deberías ver:
```
Conectando a WebSocket: ws://localhost:8080
Stream ID: 1
Token: Presente
WebSocket conectado
Enviando autenticación: {"type":"auth","token":"..."}
Mensaje recibido del servidor: {type: 'error', message: 'Tipo de mensaje desconocido'}
Error del servidor: Tipo de mensaje desconocido
```

### Qué Verificar en el Backend

1. **¿Qué tipos de mensaje acepta?**
   ```javascript
   // Busca en el código del backend algo como:
   switch(message.type) {
     case 'auth': // ¿Existe este caso?
     case 'chat_message':
     // ...
   }
   ```

2. **¿Cómo maneja la autenticación?**
   ```javascript
   // ¿Hay algo como esto?
   ws.on('message', (data) => {
     const message = JSON.parse(data);
     if (message.type === 'auth') {
       // Validar token
     }
   });
   ```

3. **¿Logs del backend?**
   Revisa los logs del servidor para ver qué está recibiendo.

---

## 💡 Soluciones Temporales

### Solución 1: Modo Local (Ya Implementado)
El chat funciona en **modo local** sin WebSocket:
- Los mensajes se muestran solo para ti
- Los puntos se suman localmente
- Todo funciona visualmente

### Solución 2: Comentar Autenticación
Si el backend no requiere autenticación inicial:

```typescript
socket.onopen = () => {
  isConnected = true;
  console.log('WebSocket conectado');
  
  // Comentar la autenticación
  // socket.send(JSON.stringify({
  //   type: 'auth',
  //   token: token
  // }));
};
```

### Solución 3: Cambiar Tipo de Autenticación
Si el backend espera otro tipo:

```typescript
socket.send(JSON.stringify({
  type: 'authenticate', // O el tipo que espere el backend
  token: token
}));
```

---

## 📋 Checklist de Verificación

### Frontend ✅
- [x] WebSocket nativo implementado
- [x] Conexión a `ws://localhost:8080`
- [x] Envío de autenticación
- [x] Envío de mensajes
- [x] Recepción de mensajes
- [x] Manejo de errores
- [x] Modo fallback local

### Backend ⏳
- [ ] WebSocket corriendo en puerto 8080
- [ ] Acepta tipo `'auth'` o similar
- [ ] Responde con `'auth_success'`
- [ ] Acepta tipo `'chat_message'`
- [ ] Responde con `'new_message'`
- [ ] Maneja errores correctamente

---

## 🎯 Próximos Pasos

1. **Revisar código del backend WebSocket**
   - Buscar qué tipos de mensaje acepta
   - Ver cómo maneja la autenticación

2. **Ajustar el frontend según el backend**
   - Cambiar tipo de autenticación si es necesario
   - Ajustar formato de mensajes

3. **Probar conexión**
   - Verificar que se autentica correctamente
   - Enviar un mensaje de prueba
   - Verificar que se recibe correctamente

---

## 📞 Preguntas para el Desarrollador del Backend

1. ¿Qué tipo de mensaje debo enviar para autenticarme?
2. ¿El token va en el mensaje o en otro lugar?
3. ¿Qué respuesta debo esperar después de autenticarme?
4. ¿Qué formato de mensaje esperas para enviar un mensaje de chat?
5. ¿Hay documentación del WebSocket del backend?

---

## ✅ Resumen

**Frontend:** Listo y funcionando ✅
**Backend:** Necesita ajustes en el manejo de mensajes ⏳

El chat funcionará perfectamente una vez que el backend acepte el tipo de mensaje `'auth'` o nos indiques qué tipo espera.

**Mientras tanto:** El chat funciona en modo local para desarrollo y pruebas visuales.
