import { createNotification, getNotificationPreferences, notificationEmitter } from "../db.js";
export class NotificationService {
    static async emit(payload) {
        try {
            const prefs = await getNotificationPreferences(payload.userId);
            const isTypeEnabled = this.isNotificationTypeEnabled(payload.type, prefs);
            if (!isTypeEnabled) {
                console.log(`[Notification] Tipo ${payload.type} desabilitado para usuário ${payload.userId}`);
                return;
            }
            if (this.isMuted(prefs)) {
                console.log(`[Notification] Usuário ${payload.userId} em horário de silêncio`);
            }
            const notificationId = await createNotification({
                userId: payload.userId,
                type: payload.type,
                title: payload.title,
                body: payload.body,
                entityType: payload.entityType,
                entityId: payload.entityId,
                channel: 'websocket',
            });
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
        }
        catch (error) {
            console.error('[Notification] Erro ao emitir notificação:', error);
        }
    }
    static isNotificationTypeEnabled(type, prefs) {
        if (!prefs)
            return true;
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
    static isMuted(prefs) {
        if (!prefs?.muteFrom || !prefs?.muteTo)
            return false;
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (prefs.muteFrom < prefs.muteTo) {
            return currentTime >= prefs.muteFrom && currentTime <= prefs.muteTo;
        }
        else {
            return currentTime >= prefs.muteFrom || currentTime <= prefs.muteTo;
        }
    }
    static async emitWhatsappMessage(userId, contactName, messagePreview, contactId, messageId) {
        await this.emit({
            userId,
            type: 'WHATSAPP_MESSAGE',
            title: `Nova mensagem de ${contactName}`,
            body: messagePreview,
            entityType: 'message',
            entityId: messageId,
        });
    }
    static async emitKanbanMove(userId, dealName, fromStage, toStage, dealId) {
        await this.emit({
            userId,
            type: 'KANBAN_MOVE',
            title: `Card movido: ${dealName}`,
            body: `${fromStage} → ${toStage}`,
            entityType: 'card',
            entityId: dealId,
        });
    }
    static async emitContactCreated(userId, contactName, contactId) {
        await this.emit({
            userId,
            type: 'CONTACT_CREATED',
            title: `Novo contato: ${contactName}`,
            body: 'Um novo contato foi adicionado',
            entityType: 'contact',
            entityId: contactId,
        });
    }
    static async emitContactUpdated(userId, contactName, contactId) {
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
