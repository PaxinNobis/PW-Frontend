// Servicio de Chat con WebSocket Nativo
import { API_CONFIG } from '../config/api.config';

let socket: WebSocket | null = null;
let isConnected = false;
let messageCallbacks: Array<(data: SendMessageResponse) => void> = [];
let historyCallbacks: Array<(messages: any[]) => void> = [];
let userJoinedCallbacks: Array<(data: { userId: string; userName: string }) => void> = [];
let userLeftCallbacks: Array<(data: { userId: string; userName: string }) => void> = [];
let currentStreamId: string | null = null;

export interface ChatMessage {
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

export interface SendMessageResponse {
  message: ChatMessage;
  pointsEarned: number;
}

/**
 * Conectar al chat de un stream
 */
export const connectToChat = (streamerNickname: string): WebSocket => {
  const token = localStorage.getItem('auth_token') || '';
  const wsUrl = API_CONFIG.BASE_URL.replace('http', 'ws');

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    socket.close();
  }

  console.log('Conectando a WebSocket:', wsUrl);
  console.log('Streamer:', streamerNickname);
  console.log('Token:', token ? 'Presente' : 'No disponible');

  socket = new WebSocket(wsUrl);
  const activeSocket = socket;

  socket.onopen = () => {
    if (socket !== activeSocket) {
      console.log('Socket obsoleto detectado durante onopen, cerrando sin unir');
      activeSocket.close();
      return;
    }
    isConnected = true;
    console.log('WebSocket conectado');
    
    // Unirse al chat con autenticación
    if (socket) {
      const joinPayload = {
        type: 'join',
        token: token,
        streamerNickname: streamerNickname
      };
      console.log('Enviando payload JOIN:', joinPayload);
      socket.send(JSON.stringify(joinPayload));
    }
  };

  socket.onmessage = (event) => {
    if (socket !== activeSocket) {
      return;
    }
    try {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido del servidor:', data);

      // Manejar diferentes tipos de mensajes
      switch (data.type) {
        case 'joined':
          console.log('Unido al chat:', data.streamerName);
          currentStreamId = data.streamId;
          break;
        case 'history':
          console.log('Historial de mensajes recibido:', data.messages);
          // Convertir historial al formato del frontend
          const historyMessages = data.messages.map((msg: any) => ({
            message: {
              id: msg.id,
              streamId: currentStreamId || '',
              userId: msg.author.id,
              texto: msg.text,
              hora: new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              user: {
                id: msg.author.id,
                name: msg.author.name,
                pfp: msg.author.pfp || 'https://via.placeholder.com/40'
              },
              createdAt: new Date(msg.createdAt)
            },
            pointsEarned: 0
          }));
          historyCallbacks.forEach(callback => callback(historyMessages));
          break;
        case 'message':
          console.log('Nuevo mensaje recibido:', data.message);
          // Convertir al formato esperado por el frontend
          const messageData: SendMessageResponse = {
            message: {
              id: data.message.id,
              streamId: currentStreamId || '',
              userId: data.message.author.id,
              texto: data.message.text,
              hora: new Date(data.message.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              user: {
                id: data.message.author.id,
                name: data.message.author.name,
                pfp: data.message.author.pfp || 'https://via.placeholder.com/40'
              },
              createdAt: new Date(data.message.createdAt)
            },
            pointsEarned: 1
          };
          messageCallbacks.forEach(callback => callback(messageData));
          break;
        case 'error':
          console.error('Error del servidor:', data.message);
          break;
        default:
          console.warn('Tipo de mensaje no manejado:', data.type);
      }
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
    }
  };

  socket.onerror = (error) => {
    if (socket !== activeSocket) {
      return;
    }
    console.error('Error en WebSocket:', error);
    isConnected = false;
  };

  socket.onclose = (event) => {
    if (socket !== activeSocket) {
      return;
    }
    isConnected = false;
    if (event.code === 4000) {
      console.log('WebSocket cerrado por sesión duplicada (código 4000).');
    } else {
      console.log('WebSocket desconectado:', event.code, event.reason || 'sin motivo');
    }
  };

  return socket;
};

/**
 * Desconectar del chat
 */
export const disconnectFromChat = () => {
  if (socket) {
    if (socket.readyState === WebSocket.CONNECTING) {
      const pendingSocket = socket;
      pendingSocket.addEventListener('open', () => pendingSocket.close(), { once: true });
    } else {
      socket.close();
    }
    socket = null;
    isConnected = false;
    messageCallbacks = [];
    historyCallbacks = [];
    userJoinedCallbacks = [];
    userLeftCallbacks = [];
    console.log('Chat desconectado');
  }
};

/**
 * Enviar mensaje al chat
 * @returns true si se envió por WebSocket, false si se manejó localmente
 */
export const sendMessage = (texto: string): boolean => {
  if (socket && isConnected) {
    const chatPayload = {
      type: 'chat',
      text: texto.trim()
    };
    console.log('Enviando payload CHAT:', chatPayload);
    socket.send(JSON.stringify(chatPayload));
    return true;
  }

  console.warn('WebSocket no disponible. El mensaje se mostrará solo localmente.');
  return false;
};

/**
 * Limpiar todos los callbacks
 */
export const clearCallbacks = () => {
  messageCallbacks = [];
  historyCallbacks = [];
  userJoinedCallbacks = [];
  userLeftCallbacks = [];
};

/**
 * Escuchar nuevos mensajes
 */
export const onNewMessage = (callback: (data: SendMessageResponse) => void) => {
  messageCallbacks.push(callback);
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Escuchar historial de mensajes
 */
export const onHistory = (callback: (messages: any[]) => void) => {
  historyCallbacks.push(callback);
  return () => {
    historyCallbacks = historyCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Escuchar cuando un usuario se une
 */
export const onUserJoined = (callback: (data: { userId: string; userName: string }) => void) => {
  userJoinedCallbacks.push(callback);
  return () => {
    userJoinedCallbacks = userJoinedCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Escuchar cuando un usuario se va
 */
export const onUserLeft = (callback: (data: { userId: string; userName: string }) => void) => {
  userLeftCallbacks.push(callback);
  return () => {
    userLeftCallbacks = userLeftCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Escuchar cuando se elimina un mensaje
 */
export const onMessageDeleted = (callback: (data: { messageId: string }) => void) => {
  // Implementar cuando sea necesario
};

/**
 * Indicar que el usuario está escribiendo
 */
export const sendTyping = (isTyping: boolean) => {
  // El backend actual no soporta eventos "typing". Se deja como no-op para evitar
  // enviar tipos desconocidos que provoquen errores.
  return;
};

/**
 * Escuchar cuando alguien está escribiendo
 */
export const onTyping = (callback: (data: { userId: string; userName: string; isTyping: boolean }) => void) => {
  // Implementar cuando sea necesario
};

/**
 * Obtener el socket actual
 */
export const getSocket = (): WebSocket | null => {
  return socket;
};
