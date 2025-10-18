import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getOrganizationLicense,
  getOrganizationWhatsappAccounts,
  getOrganizationConversations,
  getConversationMessages,
  createWhatsappAccount,
  updateWhatsappAccount,
  createWhatsappConversation,
  updateWhatsappConversation,
  createWhatsappMessage,
  getOrganization,
  createAuditLog,
  logUsage,
} from "../db";
import { nanoid } from "nanoid";

export const clientRouter = router({
  /**
   * Get client's license information
   */
  getLicense: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: Verify user belongs to organization
      const license = await getOrganizationLicense(input.organizationId);
      
      if (!license) {
        return {
          status: "no_license",
          message: "Nenhuma licença ativa encontrada",
        };
      }

      // Check if license is active
      if (license.status !== "active") {
        return {
          status: license.status,
          message: `Licença ${license.status}`,
          reason: license.reason,
        };
      }

      // Check if license is expired
      if (new Date() > license.expiryDate) {
        return {
          status: "expired",
          message: "Licença expirada",
          expiryDate: license.expiryDate,
        };
      }

      return {
        status: "active",
        license: {
          id: license.id,
          licenseKey: license.licenseKey,
          startDate: license.startDate,
          expiryDate: license.expiryDate,
          daysRemaining: Math.ceil(
            (license.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          accessCount: license.accessCount,
        },
      };
    }),

  /**
   * Get client's WhatsApp accounts
   */
  getWhatsappAccounts: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      // TODO: Verify user belongs to organization
      return await getOrganizationWhatsappAccounts(input.organizationId);
    }),

  /**
   * Connect WhatsApp account
   */
  connectWhatsappAccount: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        phoneNumber: z.string(),
        displayName: z.string(),
        accessToken: z.string(),
        businessAccountId: z.string(),
        phoneNumberId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Verify user belongs to organization
      // TODO: Verify license allows more WhatsApp accounts

      const accountId = nanoid();
      
      try {
        await createWhatsappAccount({
          id: accountId,
          organizationId: input.organizationId,
          phoneNumber: input.phoneNumber,
          displayName: input.displayName,
          accessToken: input.accessToken, // TODO: Encrypt this
          businessAccountId: input.businessAccountId,
          phoneNumberId: input.phoneNumberId,
          status: "connected",
          isDefault: false,
        });

        // Log the action
        await createAuditLog({
          id: `audit_${Date.now()}_${Math.random()}`,
          userId: ctx.user?.id || "system",
          action: "connect_whatsapp",
          resource: "whatsapp_account",
          resourceId: accountId,
          ipAddress: ctx.req.ip,
          userAgent: ctx.req.headers.get("user-agent") || undefined,
          details: JSON.stringify({ phoneNumber: input.phoneNumber }),
        });

        // Log usage
        await logUsage({
          id: `usage_${Date.now()}_${Math.random()}`,
          organizationId: input.organizationId,
          metric: "whatsapp_numbers",
          value: 1,
          date: new Date(),
        });

        return { success: true, accountId };
      } catch (error) {
        console.error("Failed to connect WhatsApp account:", error);
        throw new Error("Falha ao conectar conta WhatsApp");
      }
    }),

  /**
   * Disconnect WhatsApp account
   */
  disconnectWhatsappAccount: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        accountId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Verify user belongs to organization and account

      await updateWhatsappAccount(input.accountId, {
        status: "disconnected",
      });

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "disconnect_whatsapp",
        resource: "whatsapp_account",
        resourceId: input.accountId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({}),
      });

      return { success: true };
    }),

  /**
   * Get conversations for organization
   */
  getConversations: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        status: z.enum(["active", "archived", "closed"]).optional(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Verify user belongs to organization
      return await getOrganizationConversations(input.organizationId, input.status);
    }),

  /**
   * Get messages for a conversation
   */
  getConversationMessages: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        conversationId: z.string(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      // TODO: Verify user belongs to organization and conversation
      return await getConversationMessages(input.conversationId, input.limit);
    }),

  /**
   * Send message in conversation
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        conversationId: z.string(),
        whatsappAccountId: z.string(),
        content: z.string(),
        messageType: z.enum(["text", "image", "document", "audio", "video"]).default("text"),
        mediaUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Verify user belongs to organization
      // TODO: Verify license allows sending messages

      const messageId = nanoid();

      try {
        await createWhatsappMessage({
          id: messageId,
          organizationId: input.organizationId,
          conversationId: input.conversationId,
          whatsappAccountId: input.whatsappAccountId,
          waMessageId: `wa_${messageId}`,
          direction: "outbound",
          messageType: input.messageType as any,
          content: input.content,
          mediaUrl: input.mediaUrl,
          status: "sent",
          isFromBot: false,
        });

        // Update conversation last message time
        await updateWhatsappConversation(input.conversationId, {
          lastMessageAt: new Date(),
        });

        // Log usage
        await logUsage({
          id: `usage_${Date.now()}_${Math.random()}`,
          organizationId: input.organizationId,
          metric: "messages",
          value: 1,
          date: new Date(),
        });

        // Log the action
        await createAuditLog({
          id: `audit_${Date.now()}_${Math.random()}`,
          userId: ctx.user?.id || "system",
          action: "send_message",
          resource: "message",
          resourceId: messageId,
          ipAddress: ctx.req.ip,
          userAgent: ctx.req.headers.get("user-agent") || undefined,
          details: JSON.stringify({ conversationId: input.conversationId }),
        });

        return { success: true, messageId };
      } catch (error) {
        console.error("Failed to send message:", error);
        throw new Error("Falha ao enviar mensagem");
      }
    }),

  /**
   * Update conversation status
   */
  updateConversationStatus: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        conversationId: z.string(),
        status: z.enum(["active", "archived", "closed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Verify user belongs to organization

      await updateWhatsappConversation(input.conversationId, {
        status: input.status as any,
      });

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "update_conversation_status",
        resource: "conversation",
        resourceId: input.conversationId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({ status: input.status }),
      });

      return { success: true };
    }),

  /**
   * Get organization info (for client area)
   */
  getOrganizationInfo: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      // TODO: Verify user belongs to organization
      const org = await getOrganization(input.organizationId);
      
      if (!org) {
        throw new Error("Organização não encontrada");
      }

      return {
        id: org.id,
        name: org.name,
        email: org.email,
        status: org.status,
        maxUsers: org.maxUsers,
        currentUsers: org.currentUsers,
        maxContacts: org.maxContacts,
        maxWhatsappNumbers: org.maxWhatsappNumbers,
        createdAt: org.createdAt,
      };
    }),
});

