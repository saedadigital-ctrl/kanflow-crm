import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { MessageSquare, Kanban, Users, TrendingUp, Trash2, Archive, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationHistory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  // Queries
  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery({
    limit: 50,
  });

  // Mutations
  const markReadMutation = trpc.notifications.markRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.deleteNotification.useMutation({
    onSuccess: () => refetch(),
  });

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markReadMutation.mutateAsync({ notificationId });
      refetch();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotificationMutation.mutateAsync({ notificationId });
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WHATSAPP_MESSAGE':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'KANBAN_MOVE':
        return <Kanban className="h-5 w-5 text-purple-600" />;
      case 'CONTACT_CREATED':
      case 'CONTACT_UPDATED':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'DEAL_CREATED':
      case 'DEAL_UPDATED':
        return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-slate-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      WHATSAPP_MESSAGE: 'Mensagem WhatsApp',
      KANBAN_MOVE: 'Card Movido',
      CONTACT_CREATED: 'Contato Criado',
      CONTACT_UPDATED: 'Contato Atualizado',
      DEAL_CREATED: 'Negócio Criado',
      DEAL_UPDATED: 'Negócio Atualizado',
    };
    return labels[type] || type;
  };

  // Filtrar notificações
  let filteredNotifications = notifications || [];

  if (searchTerm) {
    filteredNotifications = filteredNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterType) {
    filteredNotifications = filteredNotifications.filter((n) => n.type === filterType);
  }

  if (filterRead === 'unread') {
    filteredNotifications = filteredNotifications.filter((n) => !n.readAt);
  } else if (filterRead === 'read') {
    filteredNotifications = filteredNotifications.filter((n) => n.readAt);
  }

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Histórico de Notificações</h1>
          <p className="text-slate-600">Visualize todas as suas notificações recentes</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo</label>
                  <select
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="WHATSAPP_MESSAGE">Mensagem WhatsApp</option>
                    <option value="KANBAN_MOVE">Card Movido</option>
                    <option value="CONTACT_CREATED">Contato Criado</option>
                    <option value="CONTACT_UPDATED">Contato Atualizado</option>
                    <option value="DEAL_CREATED">Negócio Criado</option>
                    <option value="DEAL_UPDATED">Negócio Atualizado</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                  <select
                    value={filterRead}
                    onChange={(e) => setFilterRead(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="all">Todas</option>
                    <option value="unread">Não lidas</option>
                    <option value="read">Lidas</option>
                  </select>
                </div>

                {/* Total */}
                <div className="flex items-end">
                  <div className="text-sm text-slate-600">
                    Total: <strong>{filteredNotifications.length}</strong> notificações
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-slate-400 mb-4">
                  <MessageSquare className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-slate-600 font-medium">Nenhuma notificação encontrada</p>
                <p className="text-slate-500 text-sm mt-1">Tente ajustar seus filtros</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.readAt ? 'border-blue-200 bg-blue-50' : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {notification.title}
                          </h3>
                          <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-slate-500">
                              {getTypeLabel(notification.type)}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                            {!notification.readAt && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Não lida
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.readAt && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkRead(notification.id)}
                              title="Marcar como lida"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            title="Deletar"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

