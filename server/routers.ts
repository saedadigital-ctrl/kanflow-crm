import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import { organizationsRouter } from "./routers/organizations";
import { whatsappRouter } from "./routers/whatsapp";

// Pipeline Router
const pipelineRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getPipelineStages(ctx.user.id);
  }),
  
  create: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const stages = await db.getPipelineStages(ctx.user.id);
      const order = stages.length;
      return db.createPipelineStage({
        id: nanoid(),
        name: input.name,
        color: input.color || "#3b82f6",
        order,
        userId: ctx.user.id,
      });
    }),
});

// Contacts Router
const contactsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getContacts(ctx.user.id);
  }),
  
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      phoneNumber: z.string(),
      email: z.string().optional(),
      stageId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.createContact({
        id: nanoid(),
        name: input.name,
        phoneNumber: input.phoneNumber,
        email: input.email || null,
        stageId: input.stageId || null,
        userId: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      stageId: z.string().optional(),
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.updateContact(input.id, {
        stageId: input.stageId,
        name: input.name,
      });
    }),
});

// Messages Router
const messagesRouter = router({
  list: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      return db.getMessages(input.contactId);
    }),

  create: protectedProcedure
    .input(z.object({
      contactId: z.string(),
      content: z.string(),
      direction: z.enum(["inbound", "outbound"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.createMessage({
        id: nanoid(),
        contactId: input.contactId,
        content: input.content,
        direction: input.direction,
        sentBy: ctx.user.id,
      });
    }),
});

// AI Router
const aiRouter = router({
  analyzeMessage: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      // Placeholder - será implementado com LLM
      return {
        sentiment: "neutral",
        category: "general",
        priority: "normal",
      };
    }),

  suggestResponse: protectedProcedure
    .input(z.object({ messageContent: z.string(), contactName: z.string() }))
    .mutation(async ({ input }) => {
      // Placeholder - será implementado com LLM
      return {
        suggestedResponse: `Olá ${input.contactName}, obrigado por sua mensagem. Como posso ajudá-lo?`,
        confidence: 0.85,
      };
    }),
});

// Dashboard Router
const dashboardRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await db.getContacts(ctx.user.id);
    const stages = await db.getPipelineStages(ctx.user.id);
    
    return {
      totalContacts: contacts.length,
      totalStages: stages.length,
      contactsByStage: stages.map(stage => ({
        stageName: stage.name,
        count: contacts.filter(c => c.stageId === stage.id).length,
      })),
    };
  }),
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user ?? null),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    demoLogin: publicProcedure
      .input(z.object({ role: z.enum(["admin", "user"]) }))
      .mutation(async ({ ctx, input }) => {
        const demoUserId = input.role === "admin" ? "demo-user-1" : "demo-user-2";
        const user = await db.getUser(demoUserId);
        
        if (!user) {
          throw new Error("Demo user not found");
        }
        
        const sessionToken = await sdk.createSessionToken(user.id, { name: user.name || "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
        
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
  }),

  pipeline: pipelineRouter,
  contacts: contactsRouter,
  messages: messagesRouter,
  dashboard: dashboardRouter,
  ai: aiRouter,
  org: organizationsRouter,
  whatsapp: whatsappRouter,
});

export type AppRouter = typeof appRouter;

