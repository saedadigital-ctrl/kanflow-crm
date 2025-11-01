import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc.js";
import { TRPCError } from "@trpc/server";
import * as db from "../db.js";
import { nanoid } from "nanoid";
export const whatsappRouter = router({
    accounts: router({
        list: protectedProcedure.query(async ({ ctx }) => {
            return await db.getOrganizationWhatsappAccounts(ctx.user.id);
        }),
        get: protectedProcedure
            .input(z.object({ id: z.string() }))
            .query(async ({ input }) => {
            const account = await db.getWhatsappAccount(input.id);
            if (!account) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Conta WhatsApp não encontrada' });
            }
            return account;
        }),
        create: protectedProcedure
            .input(z.object({
            organizationId: z.string(),
            phoneNumber: z.string(),
            displayName: z.string().optional(),
            accessToken: z.string(),
            businessAccountId: z.string(),
            phoneNumberId: z.string(),
        }))
            .mutation(async ({ input }) => {
            const existing = await db.getOrganizationWhatsappAccounts(input.organizationId);
            const phoneExists = existing.some(acc => acc.phoneNumber === input.phoneNumber);
            if (phoneExists) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Já existe uma conta com este número de telefone'
                });
            }
            const account = await db.createWhatsappAccount({
                id: nanoid(),
                organizationId: input.organizationId,
                phoneNumber: input.phoneNumber,
                displayName: input.displayName || input.phoneNumber,
                accessToken: input.accessToken,
                businessAccountId: input.businessAccountId,
                phoneNumberId: input.phoneNumberId,
                status: "connected",
                isDefault: existing.length === 0,
            });
            return account;
        }),
        update: protectedProcedure
            .input(z.object({
            id: z.string(),
            displayName: z.string().optional(),
            isDefault: z.boolean().optional(),
        }))
            .mutation(async ({ input }) => {
            const { id, ...data } = input;
            await db.updateWhatsappAccount(id, data);
            return { success: true };
        }),
        disconnect: protectedProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappAccount(input.id, {
                status: "disconnected",
                accessToken: null,
            });
            return { success: true, message: 'Conta desconectada com sucesso' };
        }),
        delete: protectedProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.deleteWhatsappAccount(input.id);
            return { success: true, message: 'Conta deletada com sucesso' };
        }),
    }),
    conversations: router({
        list: protectedProcedure
            .input(z.object({
            organizationId: z.string(),
            status: z.enum(["active", "archived", "closed"]).optional(),
        }))
            .query(async ({ input }) => {
            return await db.getOrganizationConversations(input.organizationId, input.status);
        }),
        get: protectedProcedure
            .input(z.object({ id: z.string() }))
            .query(async ({ input }) => {
            const conversation = await db.getWhatsappConversation(input.id);
            if (!conversation) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversa não encontrada' });
            }
            return conversation;
        }),
        getMessages: protectedProcedure
            .input(z.object({
            conversationId: z.string(),
            limit: z.number().default(50),
        }))
            .query(async ({ input }) => {
            return await db.getConversationMessages(input.conversationId, input.limit);
        }),
        assignTo: protectedProcedure
            .input(z.object({
            conversationId: z.string(),
            userId: z.string(),
        }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappConversation(input.conversationId, {
                assignedTo: input.userId,
            });
            return { success: true, message: 'Conversa atribuída com sucesso' };
        }),
        archive: protectedProcedure
            .input(z.object({ conversationId: z.string() }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappConversation(input.conversationId, {
                status: "archived",
            });
            return { success: true, message: 'Conversa arquivada com sucesso' };
        }),
        close: protectedProcedure
            .input(z.object({ conversationId: z.string() }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappConversation(input.conversationId, {
                status: "closed",
            });
            return { success: true, message: 'Conversa fechada com sucesso' };
        }),
    }),
    messages: router({
        send: protectedProcedure
            .input(z.object({
            conversationId: z.string(),
            whatsappAccountId: z.string(),
            content: z.string(),
            messageType: z.enum(["text", "image", "document", "audio", "video", "template"]).default("text"),
            mediaUrl: z.string().optional(),
        }))
            .mutation(async ({ input, ctx }) => {
            const message = await db.createWhatsappMessage({
                id: nanoid(),
                organizationId: ctx.user.id,
                conversationId: input.conversationId,
                whatsappAccountId: input.whatsappAccountId,
                direction: "outbound",
                messageType: input.messageType,
                content: input.content,
                mediaUrl: input.mediaUrl,
                status: "sent",
                senderPhone: "",
                isFromBot: false,
            });
            return message;
        }),
        markAsRead: protectedProcedure
            .input(z.object({ messageId: z.string() }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappMessage(input.messageId, {
                status: "read",
            });
            return { success: true };
        }),
    }),
    templates: router({
        list: protectedProcedure
            .input(z.object({ organizationId: z.string() }))
            .query(async ({ input }) => {
            return await db.getOrganizationTemplates(input.organizationId);
        }),
        getApproved: protectedProcedure
            .input(z.object({ organizationId: z.string() }))
            .query(async ({ input }) => {
            return await db.getApprovedTemplates(input.organizationId);
        }),
        create: protectedProcedure
            .input(z.object({
            organizationId: z.string(),
            whatsappAccountId: z.string(),
            name: z.string(),
            category: z.enum(["marketing", "authentication", "utility"]),
            language: z.string().default("pt_BR"),
            headerText: z.string().optional(),
            bodyText: z.string(),
            footerText: z.string().optional(),
            buttons: z.string().optional(),
        }))
            .mutation(async ({ input }) => {
            const template = await db.createWhatsappTemplate({
                id: nanoid(),
                organizationId: input.organizationId,
                whatsappAccountId: input.whatsappAccountId,
                name: input.name,
                category: input.category,
                language: input.language,
                headerText: input.headerText,
                bodyText: input.bodyText,
                footerText: input.footerText,
                buttons: input.buttons,
                status: "pending",
            });
            return template;
        }),
        delete: protectedProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.updateWhatsappTemplate(input.id, {
                status: "rejected",
            });
            return { success: true };
        }),
    }),
    webhooks: router({
        getForAccount: protectedProcedure
            .input(z.object({ whatsappAccountId: z.string() }))
            .query(async ({ input }) => {
            return await db.getAccountWebhook(input.whatsappAccountId);
        }),
        setup: protectedProcedure
            .input(z.object({
            organizationId: z.string(),
            whatsappAccountId: z.string(),
        }))
            .mutation(async ({ input }) => {
            const webhookUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/webhooks/whatsapp/${input.organizationId}`;
            const verifyToken = nanoid(32);
            const webhook = await db.createWhatsappWebhook({
                id: nanoid(),
                organizationId: input.organizationId,
                whatsappAccountId: input.whatsappAccountId,
                webhookUrl,
                verifyToken,
                isActive: true,
            });
            return {
                webhookUrl,
                verifyToken,
                instructions: "Configure este webhook na Meta App Dashboard para receber mensagens em tempo real",
            };
        }),
    }),
    stats: router({
        accountStats: protectedProcedure
            .input(z.object({ accountId: z.string() }))
            .query(async ({ input }) => {
            return {
                totalConversations: 0,
                activeConversations: 0,
                totalMessages: 0,
                averageResponseTime: 0,
                lastMessageTime: null,
            };
        }),
    }),
});
