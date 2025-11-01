import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notificações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Nenhuma notificação
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markAsRead}
                />
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="p-4 border-t text-center">
              <Button variant="outline" size="sm" className="w-full">
                Ver todas as notificações
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface NotificationItemProps {
  notification: any;
  onMarkRead: (id: string) => void;
}

function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'WHATSAPP_MESSAGE':
        return '💬';
      case 'KANBAN_MOVE':
        return '📋';
      case 'CONTACT_CREATED':
      case 'CONTACT_UPDATED':
        return '👤';
      default:
        return '🔔';
    }
  };

  const isUnread = !notification.readAt;

  return (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
        isUnread && 'bg-blue-50'
      )}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{getIcon(notification.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {notification.body}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleTimeString('pt-BR')}
          </p>
        </div>
        {isUnread && (
          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
        )}
      </div>
    </div>
  );
}

