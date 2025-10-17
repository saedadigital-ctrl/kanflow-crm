import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Pipeline Stages
  pipeline: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPipelineStages(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        order: z.number(),
        color: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createPipelineStage({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        order: z.number().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updatePipelineStage(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deletePipelineStage(input.id);
        return { success: true };
      }),
  }),

  // Contacts
  contacts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getContacts(ctx.user.id);
    }),

    byStage: protectedProcedure
      .input(z.object({ stageId: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getContactsByStage(ctx.user.id, input.stageId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getContact(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        phoneNumber: z.string(),
        email: z.string().optional(),
        notes: z.string().optional(),
        tags: z.string().optional(),
        stageId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createContact({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        notes: z.string().optional(),
        tags: z.string().optional(),
        stageId: z.string().optional(),
        avatarUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateContact(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteContact(input.id);
        return { success: true };
      }),
  }),

  // Messages
  messages: router({
    byContact: protectedProcedure
      .input(z.object({ contactId: z.string() }))
      .query(async ({ input }) => {
        return await db.getMessagesByContact(input.contactId);
      }),

    send: protectedProcedure
      .input(z.object({
        contactId: z.string(),
        content: z.string(),
        mediaUrl: z.string().optional(),
        mediaType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createMessage({
          id,
          contactId: input.contactId,
          content: input.content,
          direction: "outbound",
          status: "sent",
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
          sentBy: ctx.user.id,
        });
        
        // Update contact's lastMessageAt
        await db.updateContact(input.contactId, {
          lastMessageAt: new Date(),
        });
        
        return { id };
      }),
  }),

  // Automations
  automations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAutomations(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getAutomation(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        trigger: z.string(),
        triggerConfig: z.string().optional(),
        action: z.string(),
        actionConfig: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createAutomation({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        trigger: z.string().optional(),
        triggerConfig: z.string().optional(),
        action: z.string().optional(),
        actionConfig: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateAutomation(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteAutomation(input.id);
        return { success: true };
      }),
  }),

  // AI Agents
  aiAgents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAiAgents(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getAiAgent(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        systemPrompt: z.string(),
        temperature: z.number().optional(),
        isActive: z.boolean().optional(),
        autoReply: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createAiAgent({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        systemPrompt: z.string().optional(),
        temperature: z.number().optional(),
        isActive: z.boolean().optional(),
        autoReply: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateAiAgent(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteAiAgent(input.id);
        return { success: true };
      }),
  }),

  // WhatsApp Integrations
  whatsapp: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getWhatsappIntegrations(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getWhatsappIntegration(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        phoneNumber: z.string(),
        businessAccountId: z.string().optional(),
        accessToken: z.string().optional(),
        webhookVerifyToken: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createWhatsappIntegration({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        phoneNumber: z.string().optional(),
        businessAccountId: z.string().optional(),
        accessToken: z.string().optional(),
        webhookVerifyToken: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateWhatsappIntegration(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteWhatsappIntegration(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

