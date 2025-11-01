import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { securityRouter } from "./routers/security.js";
import { adminRouter } from "./routers/admin.js";
import { clientRouter } from "./routers/clientRouter.js";
import { whatsappRouter } from "./routers/whatsapp.js";
import { notificationsRouter } from "./routers/notifications.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";
import { z } from "zod";
import * as db from "./db.js";
import { nanoid } from "nanoid";
export const appRouter = router({
    system: systemRouter,
    security: securityRouter,
    admin: adminRouter,
    app: clientRouter,
    whatsapp: whatsappRouter,
    notifications: notificationsRouter,
    auth: router({
        me: publicProcedure.query(opts => opts.ctx.user),
        logout: publicProcedure.mutation(({ ctx }) => {
            const cookieOptions = getSessionCookieOptions(ctx.req);
            ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
            return {
                success: true,
            };
        }),
    }),
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
            await db.updateContact(input.contactId, {
                lastMessageAt: new Date(),
            });
            return { id };
        }),
    }),
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
});
