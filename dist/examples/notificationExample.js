/**
 * EXEMPLO: Como usar o sistema de notificações
 *
 * Este arquivo demonstra como integrar notificações em diferentes
 * eventos da aplicação (WhatsApp, Kanban, Contatos, etc)
 */
import { NotificationService } from "../services/notificationService.js";
// ============================================
// EXEMPLO 1: Notificação de Nova Mensagem WhatsApp
// ============================================
export async function exampleWhatsappNotification() {
    // Quando uma nova mensagem chega do WhatsApp
    const userId = 'user-123';
    const contactName = 'João Silva';
    const messagePreview = 'Oi, tudo bem? Preciso de ajuda com...';
    const contactId = 'contact-456';
    const messageId = 'msg-789';
    await NotificationService.emitWhatsappMessage(userId, contactName, messagePreview, contactId, messageId);
}
// ============================================
// EXEMPLO 2: Notificação de Card Movido no Kanban
// ============================================
export async function exampleKanbanNotification() {
    // Quando um card é movido entre colunas
    const userId = 'user-123';
    const dealName = 'Projeto Website';
    const fromStage = 'Em Negociação';
    const toStage = 'Ganho';
    const dealId = 'deal-123';
    await NotificationService.emitKanbanMove(userId, dealName, fromStage, toStage, dealId);
}
// ============================================
// EXEMPLO 3: Notificação de Contato Criado
// ============================================
export async function exampleContactCreatedNotification() {
    // Quando um novo contato é criado
    const userId = 'user-123';
    const contactName = 'Maria Santos';
    const contactId = 'contact-789';
    await NotificationService.emitContactCreated(userId, contactName, contactId);
}
// ============================================
// EXEMPLO 4: Notificação Customizada
// ============================================
export async function exampleCustomNotification() {
    // Para notificações customizadas
    await NotificationService.emit({
        userId: 'user-123',
        type: 'DEAL_CREATED',
        title: 'Novo Negócio Criado',
        body: 'Um novo negócio foi criado: Consultoria Estratégica',
        entityType: 'deal',
        entityId: 'deal-999',
    });
}
// ============================================
// INTEGRAÇÃO COM ROUTERS tRPC
// ============================================
/**
 * Exemplo de como integrar no router de WhatsApp:
 *
 * export const whatsappRouter = router({
 *   receiveMessage: protectedProcedure
 *     .input(z.object({
 *       contactId: z.string(),
 *       message: z.string(),
 *     }))
 *     .mutation(async ({ ctx, input }) => {
 *       // Salvar mensagem no banco
 *       const messageId = await saveMessage(input);
 *
 *       // Emitir notificação
 *       const contact = await getContact(input.contactId);
 *       await NotificationService.emitWhatsappMessage(
 *         ctx.user.id,
 *         contact.name,
 *         input.message.substring(0, 50),
 *         input.contactId,
 *         messageId
 *       );
 *
 *       return { success: true };
 *     }),
 * });
 */
// ============================================
// INTEGRAÇÃO COM EVENTOS DE KANBAN
// ============================================
/**
 * Exemplo de como integrar no router de Pipeline:
 *
 * export const pipelineRouter = router({
 *   moveCard: protectedProcedure
 *     .input(z.object({
 *       dealId: z.string(),
 *       fromStageId: z.string(),
 *       toStageId: z.string(),
 *     }))
 *     .mutation(async ({ ctx, input }) => {
 *       // Mover card no banco
 *       await updateDealStage(input.dealId, input.toStageId);
 *
 *       // Obter informações para notificação
 *       const deal = await getDeal(input.dealId);
 *       const fromStage = await getStage(input.fromStageId);
 *       const toStage = await getStage(input.toStageId);
 *
 *       // Emitir notificação
 *       await NotificationService.emitKanbanMove(
 *         ctx.user.id,
 *         deal.name,
 *         fromStage.name,
 *         toStage.name,
 *         input.dealId
 *       );
 *
 *       return { success: true };
 *     }),
 * });
 */
