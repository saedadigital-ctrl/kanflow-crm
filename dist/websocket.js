import { Server as SocketIOServer } from 'socket.io';
import { notificationEmitter } from "./db.js";
import jwt from 'jsonwebtoken';
const connectedUsers = new Map();
export function initializeWebSocket(httpServer) {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.VITE_FRONTEND_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Token não fornecido'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            socket.data.userId = decoded.userId || decoded.sub;
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            console.error('[WebSocket] Erro ao verificar token:', error);
            next(new Error('Token inválido'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        console.log(`[WebSocket] Usuário ${userId} conectado (${socket.id})`);
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId).add(socket.id);
        socket.join(`user:${userId}`);
        socket.emit('connected', {
            userId,
            socketId: socket.id,
            timestamp: new Date().toISOString(),
        });
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
        socket.on('notification:read', (data) => {
            console.log(`[WebSocket] Notificação ${data.notificationId} marcada como lida`);
        });
    });
    notificationEmitter.on('notification:new', (notification) => {
        const { userId, ...payload } = notification;
        console.log(`[WebSocket] Emitindo notificação para ${userId}`);
        io.to(`user:${userId}`).emit('notification:new', payload);
    });
    return io;
}
export function getConnectedUsersCount() {
    return connectedUsers.size;
}
export function isUserConnected(userId) {
    return connectedUsers.has(userId) && connectedUsers.get(userId).size > 0;
}
