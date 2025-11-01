# Sistema de Notificações em Tempo Real

## Visão Geral

O sistema de notificações fornece comunicação em tempo real entre o servidor e os clientes usando WebSocket (Socket.io). As notificações são persistidas no banco de dados e podem ser gerenciadas por preferências do usuário.

## Arquitetura

### Backend

- **`server/db.ts`**: Funções para criar, recuperar e gerenciar notificações
- **`server/services/notificationService.ts`**: Serviço centralizado para emitir notificações
- **`server/websocket.ts`**: Configuração do Socket.io e gerenciamento de conexões
- **`server/routers/notifications.ts`**: Endpoints tRPC para notificações

### Frontend

- **`client/src/hooks/useNotifications.ts`**: Hook React para gerenciar notificações
- **`client/src/components/NotificationBell.tsx`**: Componente de sino de notificações
- **`client/src/pages/NotificationPreferences.tsx`**: Página de configuração de preferências

### Banco de Dados

Duas tabelas principais:

1. **`notifications`**: Histórico de notificações
   - `id`: Identificador único
   - `userId`: Usuário que recebe
   - `type`: Tipo de notificação
   - `title`: Título
   - `body`: Corpo da mensagem
   - `entityType`: Tipo de entidade (message, card, contact, etc)
   - `entityId`: ID da entidade
   - `channel`: Canal de entrega (websocket, email, etc)
   - `readAt`: Quando foi lida
   - `createdAt`: Quando foi criada

2. **`notification_preferences`**: Preferências por usuário
   - `userId`: Usuário
   - `enableSound`: Habilitar som
   - `muteFrom`/`muteTo`: Horário de silêncio
   - `whatsappMessage`: Notificações de mensagens WhatsApp
   - `kanbanMove`: Notificações de movimentação de cards
   - `contactUpdate`: Notificações de contatos
   - `channels`: Canais habilitados

## Como Usar

### 1. Emitir uma Notificação

```typescript
import { NotificationService } from '../services/notificationService';

// Notificação de mensagem WhatsApp
await NotificationService.emitWhatsappMessage(
  userId,
  'João Silva',
  'Oi, tudo bem?',
  contactId,
  messageId
);

// Notificação de card movido
await NotificationService.emitKanbanMove(
  userId,
  'Projeto Website',
  'Em Negociação',
  'Ganho',
  dealId
);

// Notificação customizada
await NotificationService.emit({
  userId,
  type: 'DEAL_CREATED',
  title: 'Novo Negócio',
  body: 'Um novo negócio foi criado',
  entityType: 'deal',
  entityId: dealId,
});
```

### 2. Integrar com Router tRPC

```typescript
export const whatsappRouter = router({
  receiveMessage: protectedProcedure
    .input(z.object({
      contactId: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Salvar mensagem
      const messageId = await saveMessage(input);
      
      // Emitir notificação
      const contact = await getContact(input.contactId);
      await NotificationService.emitWhatsappMessage(
        ctx.user.id,
        contact.name,
        input.message.substring(0, 50),
        input.contactId,
        messageId
      );
      
      return { success: true };
    }),
});
```

### 3. Usar no Frontend

```typescript
import { useNotifications } from '@/hooks/useNotifications';

export function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead,
    isConnected 
  } = useNotifications();

  return (
    <div>
      <p>Notificações não lidas: {unreadCount}</p>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.title}
        </div>
      ))}
    </div>
  );
}
```

### 4. Adicionar NotificationBell ao Layout

```typescript
import { NotificationBell } from '@/components/NotificationBell';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1>App</h1>
      <NotificationBell />
    </header>
  );
}
```

## Tipos de Notificações

| Tipo | Descrição | Gatilho |
|------|-----------|---------|
| `WHATSAPP_MESSAGE` | Nova mensagem WhatsApp | Mensagem recebida |
| `KANBAN_MOVE` | Card movido entre colunas | Card movido |
| `CONTACT_CREATED` | Novo contato criado | Contato criado |
| `CONTACT_UPDATED` | Contato atualizado | Contato atualizado |
| `DEAL_CREATED` | Novo negócio criado | Negócio criado |
| `DEAL_UPDATED` | Negócio atualizado | Negócio atualizado |

## Preferências de Notificação

Cada usuário pode configurar:

- **Som**: Ativar/desativar som de notificação
- **Horário de Silêncio**: Período para não receber notificações
- **Tipos**: Quais tipos de notificações receber
- **Canais**: Como receber (WebSocket, Email, etc)

## Endpoints tRPC

### `notifications.list`
Obter lista de notificações do usuário

```typescript
const { data } = trpc.notifications.list.useQuery({ limit: 20 });
```

### `notifications.countUnread`
Contar notificações não lidas

```typescript
const { data } = trpc.notifications.countUnread.useQuery();
```

### `notifications.markRead`
Marcar notificação como lida

```typescript
await trpc.notifications.markRead.useMutation().mutateAsync({ 
  notificationId: 'id' 
});
```

### `notifications.getPreferences`
Obter preferências do usuário

```typescript
const { data } = trpc.notifications.getPreferences.useQuery();
```

### `notifications.updatePreferences`
Atualizar preferências

```typescript
await trpc.notifications.updatePreferences.useMutation().mutateAsync({
  enableSound: true,
  muteFrom: '22:00',
  muteTo: '08:00',
  whatsappMessage: true,
  kanbanMove: true,
  contactUpdate: false,
});
```

## WebSocket Events

### Cliente → Servidor

- `notification:read`: Marcar notificação como lida

### Servidor → Cliente

- `connected`: Confirmação de conexão
- `notification:new`: Nova notificação recebida
- `disconnect`: Desconexão

## Segurança

- Autenticação via JWT token
- Cada usuário só recebe suas próprias notificações
- Validação de permissões em todos os endpoints

## Performance

- Limite de 20 notificações por query (paginação)
- Índices no banco para `userId` e `createdAt`
- Cache de preferências em memória
- Emitter de eventos para escalabilidade

## Próximas Melhorias

- [ ] Notificações por email
- [ ] Notificações push (mobile)
- [ ] Agrupamento de notificações similares
- [ ] Filtros avançados
- [ ] Histórico com busca
- [ ] Notificações em tempo real para múltiplos dispositivos

