import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { notificationEmitter } from './db';
import jwt from 'jsonwebtoken';

// Map de usuários conectados
const connectedUsers = new Map<string, Set<string>>();

/**
 * Inicializar WebSocket com Socket.io
 */
export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.VITE_FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Middleware de autenticação
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      socket.data.userId = (decoded as any).userId || (decoded as any).sub;
      socket.data.user = decoded;
      next();
    } catch (error) {
      console.error('[WebSocket] Erro ao verificar token:', error);
      next(new Error('Token inválido'));
    }
  });

  // Conexão
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`[WebSocket] Usuário ${userId} conectado (${socket.id})`);

    // Adicionar usuário à lista de conectados
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId)!.add(socket.id);

    // Juntar ao room do usuário
    socket.join(`user:${userId}`);

    // Enviar confirmação de conexão
    socket.emit('connected', {
      userId,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Usuário ${userId} desconectado (${socket.id})`);
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
    });

    // Marcar notificação como lida
    socket.on('notification:read', (data: { notificationId: string }) => {
      console.log(`[WebSocket] Notificação ${data.notificationId} marcada como lida`);
      // Evento será processado via tRPC
    });
  });

  // Listener de eventos de notificação
  notificationEmitter.on('notification:new', (notification) => {
    const { userId, ...payload } = notification;
    console.log(`[WebSocket] Emitindo notificação para ${userId}`);
    io.to(`user:${userId}`).emit('notification:new', payload);
  });

  return io;
}

/**
 * Obter número de usuários conectados
 */
export function getConnectedUsersCount(): number {
  return connectedUsers.size;
}

/**
 * Verificar se usuário está conectado
 */
export function isUserConnected(userId: string): boolean {
  return connectedUsers.has(userId) && connectedUsers.get(userId)!.size > 0;
}

