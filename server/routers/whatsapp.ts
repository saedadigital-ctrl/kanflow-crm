import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getWhatsappConfig,
  saveWhatsappConfig,
  testWhatsappConnection,
  getConversations,
  getConversationById,
  createConversation,
  updateConversationStatus,
  markConversationAsRead,
  incrementUnreadCount,
} from "../db/whatsapp";

// Schemas
const whatsappConfigSchema = z.object({
  organizationId: z.string(),
  phoneNumber: z.string(),
  displayName: z.string().optional(),
  accessToken: z.string().optional(),
  businessAccountId: z.string().optional(),
  phoneNumberId: z.string().optional(),
});

const conversationStatusSchema = z.enum([
  "active",
  "waiting",
  "resolved",
  "archived",
]);

export const whatsappRouter = router({
  // ============================================
  // WHATSAPP CONFIG
  // ============================================

  /**
   * Obter configuração WhatsApp
   */
  config: router({
    get: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ input }) => {
        try {
          const config = await getWhatsappConfig(input.organizationId);
          return {
            success: true,
            data: config,
          };
        } catch (error) {
          console.error("[whatsapp.config.get] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao obter configuração",
          });
        }
      }),

    /**
     * Salvar configuração WhatsApp
     */
    save: protectedProcedure
      .input(whatsappConfigSchema)
      .mutation(async ({ input }) => {
        try {
          const config = await saveWhatsappConfig(
            input.organizationId,
            input
          );
          return {
            success: true,
            data: config,
            message: "Configuração salva com sucesso",
          };
        } catch (error) {
          console.error("[whatsapp.config.save] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao salvar configuração",
          });
        }
      }),

    /**
     * Testar conexão WhatsApp
     */
    test: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const result = await testWhatsappConnection(input.organizationId);
          return {
            success: result.success,
            message: result.message,
            data: result,
          };
        } catch (error) {
          console.error("[whatsapp.config.test] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao testar conexão",
          });
        }
      }),
  }),

  // ============================================
  // CONVERSATIONS
  // ============================================

  conversations: router({
    /**
     * Listar conversas
     */
    list: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ input }) => {
        try {
          const conversations = await getConversations(input.organizationId);
          return {
            success: true,
            data: conversations,
          };
        } catch (error) {
          console.error("[whatsapp.conversations.list] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao listar conversas",
          });
        }
      }),

    /**
     * Obter conversa por ID
     */
    get: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          organizationId: z.string(),
        })
      )
      .query(async ({ input }) => {
        try {
          const conversation = await getConversationById(
            input.id,
            input.organizationId
          );
          if (!conversation) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Conversa não encontrada",
            });
          }
          return {
            success: true,
            data: conversation,
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("[whatsapp.conversations.get] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao obter conversa",
          });
        }
      }),

    /**
     * Criar conversa
     */
    create: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          contactId: z.string(),
          lastSnippet: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const conversation = await createConversation(
            input.organizationId,
            input.contactId,
            input.lastSnippet
          );
          return {
            success: true,
            data: conversation,
            message: "Conversa criada com sucesso",
          };
        } catch (error) {
          console.error("[whatsapp.conversations.create] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao criar conversa",
          });
        }
      }),

    /**
     * Atualizar status da conversa
     */
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          organizationId: z.string(),
          status: conversationStatusSchema,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await updateConversationStatus(
            input.id,
            input.organizationId,
            input.status
          );
          return {
            success: true,
            data: result,
            message: "Status atualizado com sucesso",
          };
        } catch (error) {
          console.error("[whatsapp.conversations.updateStatus] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao atualizar status",
          });
        }
      }),

    /**
     * Marcar como lida
     */
    markAsRead: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          organizationId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await markConversationAsRead(
            input.id,
            input.organizationId
          );
          return {
            success: true,
            data: result,
            message: "Conversa marcada como lida",
          };
        } catch (error) {
          console.error("[whatsapp.conversations.markAsRead] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao marcar como lida",
          });
        }
      }),

    /**
     * Incrementar não lidas
     */
    incrementUnread: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          organizationId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await incrementUnreadCount(
            input.id,
            input.organizationId
          );
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          console.error("[whatsapp.conversations.incrementUnread] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao incrementar não lidas",
          });
        }
      }),
  }),
});

