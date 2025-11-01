import { NotificationService } from "../services/notificationService.js";
export async function exampleWhatsappNotification() {
    const userId = 'user-123';
    const contactName = 'João Silva';
    const messagePreview = 'Oi, tudo bem? Preciso de ajuda com...';
    const contactId = 'contact-456';
    const messageId = 'msg-789';
    await NotificationService.emitWhatsappMessage(userId, contactName, messagePreview, contactId, messageId);
}
export async function exampleKanbanNotification() {
    const userId = 'user-123';
    const dealName = 'Projeto Website';
    const fromStage = 'Em Negociação';
    const toStage = 'Ganho';
    const dealId = 'deal-123';
    await NotificationService.emitKanbanMove(userId, dealName, fromStage, toStage, dealId);
}
export async function exampleContactCreatedNotification() {
    const userId = 'user-123';
    const contactName = 'Maria Santos';
    const contactId = 'contact-789';
    await NotificationService.emitContactCreated(userId, contactName, contactId);
}
export async function exampleCustomNotification() {
    await NotificationService.emit({
        userId: 'user-123',
        type: 'DEAL_CREATED',
        title: 'Novo Negócio Criado',
        body: 'Um novo negócio foi criado: Consultoria Estratégica',
        entityType: 'deal',
        entityId: 'deal-999',
    });
}
