import { 
  createNotification, 
  getNotificationPreferences,
  notificationEmitter
} from '../db';
import type { InsertNotification } from '../../drizzle/schema';

export interface NotificationPayload {
  userId: string;
  type: 'WHATSAPP_MESSAGE' | 'KANBAN_MOVE' | 'CONTACT_CREATED' | 'CONTACT_UPDATED' | 'DEAL_CREATED' | 'DEAL_UPDATED';
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
}

/**
 * Notification Service - Gerencia criação e envio de notificações
 */
export class NotificationService {
  /**
   * Emitir uma notificação respeitando preferências do usuário
   */
  static async emit(payload: NotificationPayload) {
    try {
      // Obter preferências do usuário
      const prefs = await getNotificationPreferences(payload.userId);

      // Verificar se o tipo de notificação está habilitado
      const isTypeEnabled = this.isNotificationTypeEnabled(payload.type, prefs);
      if (!isTypeEnabled) {
        console.log(`[Notification] Tipo ${payload.type} desabilitado para usuário ${payload.userId}`);
        return;
      }

      // Verificar se está em horário de silêncio
      if (this.isMuted(prefs)) {
        console.log(`[Notification] Usuário ${payload.userId} em horário de silêncio`);
      }

      // Criar notificação no banco
      const notificationId = await createNotification({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        entityType: payload.entityType,
        entityId: payload.entityId,
        channel: 'websocket',
      } as InsertNotification);

      // Emitir evento para WebSocket
      notificationEmitter.emit('notification:new', {
        id: notificationId,
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        entityType: payload.entityType,
        entityId: payload.entityId,
        createdAt: new Date().toISOString(),
        enableSound: prefs?.enableSound ?? true,
        isMuted: this.isMuted(prefs),
      });

      console.log(`[Notification] Notificação ${notificationId} emitida para ${payload.userId}`);
    } catch (error) {
      console.error('[Notification] Erro ao emitir notificação:', error);
    }
  }

  /**
   * Verificar se o tipo de notificação está habilitado
   */
  private static isNotificationTypeEnabled(type: string, prefs: any): boolean {
    if (!prefs) return true; // Default: habilitado se sem preferências

    switch (type) {
      case 'WHATSAPP_MESSAGE':
        return prefs.whatsappMessage !== false;
      case 'KANBAN_MOVE':
        return prefs.kanbanMove !== false;
      case 'CONTACT_CREATED':
      case 'CONTACT_UPDATED':
        return prefs.contactUpdate !== false;
      default:
        return true;
    }
  }

  /**
   * Verificar se o usuário está em horário de silêncio
   */
  private static isMuted(prefs: any): boolean {
    if (!prefs?.muteFrom || !prefs?.muteTo) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Se muteFrom < muteTo (ex: 22:00 a 08:00 = silencioso à noite)
    if (prefs.muteFrom < prefs.muteTo) {
      return currentTime >= prefs.muteFrom && currentTime <= prefs.muteTo;
    } else {
      // Se muteFrom > muteTo (ex: 22:00 a 08:00 = silencioso à noite)
      return currentTime >= prefs.muteFrom || currentTime <= prefs.muteTo;
    }
  }

  /**
   * Emitir notificação de nova mensagem WhatsApp
   */
  static async emitWhatsappMessage(userId: string, contactName: string, messagePreview: string, contactId: string, messageId: string) {
    await this.emit({
      userId,
      type: 'WHATSAPP_MESSAGE',
      title: `Nova mensagem de ${contactName}`,
      body: messagePreview,
      entityType: 'message',
      entityId: messageId,
    });
  }

  /**
   * Emitir notificação de card movido
   */
  static async emitKanbanMove(userId: string, dealName: string, fromStage: string, toStage: string, dealId: string) {
    await this.emit({
      userId,
      type: 'KANBAN_MOVE',
      title: `Card movido: ${dealName}`,
      body: `${fromStage} → ${toStage}`,
      entityType: 'card',
      entityId: dealId,
    });
  }

  /**
   * Emitir notificação de contato criado
   */
  static async emitContactCreated(userId: string, contactName: string, contactId: string) {
    await this.emit({
      userId,
      type: 'CONTACT_CREATED',
      title: `Novo contato: ${contactName}`,
      body: 'Um novo contato foi adicionado',
      entityType: 'contact',
      entityId: contactId,
    });
  }

  /**
   * Emitir notificação de contato atualizado
   */
  static async emitContactUpdated(userId: string, contactName: string, contactId: string) {
    await this.emit({
      userId,
      type: 'CONTACT_UPDATED',
      title: `Contato atualizado: ${contactName}`,
      body: 'As informações do contato foram atualizadas',
      entityType: 'contact',
      entityId: contactId,
    });
  }
}

