import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export interface Notification {
  id: string;
  type: 'WHATSAPP_MESSAGE' | 'KANBAN_MOVE' | 'CONTACT_CREATED' | 'CONTACT_UPDATED' | 'DEAL_CREATED' | 'DEAL_UPDATED';
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  enableSound: boolean;
  isMuted: boolean;
}

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Queries tRPC
  const { data: notificationsList } = trpc.notifications.list.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const { data: unreadData } = trpc.notifications.countUnread.useQuery(
    {},
    { enabled: isAuthenticated, refetchInterval: 30000 }
  );

  const markReadMutation = trpc.notifications.markRead.useMutation();
  const markMultipleReadMutation = trpc.notifications.markMultipleRead.useMutation();

  // Conectar ao WebSocket
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const socket = io(window.location.origin, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connected', (data) => {
      console.log('[Notifications] Conectado ao WebSocket:', data);
    });

    socket.on('notification:new', (notification: Notification) => {
      console.log('[Notifications] Nova notificação recebida:', notification);
      
      // Adicionar à lista
      setNotifications((prev) => [notification, ...prev].slice(0, 20));
      
      // Atualizar contador
      setUnreadCount((prev) => prev + 1);

      // Reproduzir som se habilitado
      if (notification.enableSound && !notification.isMuted) {
        playNotificationSound();
      }

      // Mostrar notificação do navegador se suportado
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('[Notifications] Desconectado do WebSocket');
    });

    socket.on('error', (error) => {
      console.error('[Notifications] Erro no WebSocket:', error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Atualizar lista de notificações
  useEffect(() => {
    if (notificationsList) {
      setNotifications(notificationsList);
    }
  }, [notificationsList]);

  // Atualizar contador de não lidas
  useEffect(() => {
    if (unreadData) {
      setUnreadCount(unreadData.unreadCount);
    }
  }, [unreadData]);

  // Reproduzir som de notificação
  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/notification-sound.mp3');
    }
    audioRef.current.play().catch((err) => {
      console.warn('[Notifications] Erro ao reproduzir som:', err);
    });
  }, []);

  // Marcar notificação como lida
  const markAsRead = useCallback(
    async (notificationId: string) => {
      await markReadMutation.mutateAsync({ notificationId });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [markReadMutation]
  );

  // Marcar múltiplas como lidas
  const markMultipleAsRead = useCallback(
    async (notificationIds: string[]) => {
      await markMultipleReadMutation.mutateAsync({ notificationIds });
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
    },
    [markMultipleReadMutation]
  );

  // Solicitar permissão de notificação do navegador
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markMultipleAsRead,
    playNotificationSound,
    requestNotificationPermission,
    isConnected: socketRef.current?.connected ?? false,
  };
}

