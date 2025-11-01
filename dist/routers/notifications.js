import { z } from 'zod';
import { protectedProcedure, router } from "../_core/trpc.js";
import { getUserNotifications, markNotificationAsRead, markNotificationsAsRead, getNotificationPreferences, upsertNotificationPreferences, countUnreadNotifications } from "../db.js";
export const notificationsRouter = router({
    list: protectedProcedure
        .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
    }))
        .query(async ({ ctx, input }) => {
        const notifications = await getUserNotifications(ctx.user.id, input.limit);
        return notifications;
    }),
    countUnread: protectedProcedure
        .query(async ({ ctx }) => {
        const count = await countUnreadNotifications(ctx.user.id);
        return { unreadCount: count };
    }),
    markRead: protectedProcedure
        .input(z.object({
        notificationId: z.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        await markNotificationAsRead(input.notificationId);
        return { success: true };
    }),
    markMultipleRead: protectedProcedure
        .input(z.object({
        notificationIds: z.array(z.string()),
    }))
        .mutation(async ({ ctx, input }) => {
        if (input.notificationIds.length > 0) {
            await markNotificationsAsRead(input.notificationIds);
        }
        return { success: true };
    }),
    getPreferences: protectedProcedure
        .query(async ({ ctx }) => {
        const prefs = await getNotificationPreferences(ctx.user.id);
        return prefs || {
            userId: ctx.user.id,
            enableSound: true,
            muteFrom: null,
            muteTo: null,
            whatsappMessage: true,
            kanbanMove: true,
            contactUpdate: false,
            channels: JSON.stringify(['websocket']),
        };
    }),
    updatePreferences: protectedProcedure
        .input(z.object({
        enableSound: z.boolean().optional(),
        muteFrom: z.string().nullable().optional(),
        muteTo: z.string().nullable().optional(),
        whatsappMessage: z.boolean().optional(),
        kanbanMove: z.boolean().optional(),
        contactUpdate: z.boolean().optional(),
        channels: z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        const currentPrefs = await getNotificationPreferences(ctx.user.id);
        const updated = {
            userId: ctx.user.id,
            enableSound: input.enableSound ?? currentPrefs?.enableSound ?? true,
            muteFrom: input.muteFrom ?? currentPrefs?.muteFrom,
            muteTo: input.muteTo ?? currentPrefs?.muteTo,
            whatsappMessage: input.whatsappMessage ?? currentPrefs?.whatsappMessage ?? true,
            kanbanMove: input.kanbanMove ?? currentPrefs?.kanbanMove ?? true,
            contactUpdate: input.contactUpdate ?? currentPrefs?.contactUpdate ?? false,
            channels: input.channels ?? currentPrefs?.channels ?? JSON.stringify(['websocket']),
        };
        await upsertNotificationPreferences(updated);
        return updated;
    }),
});
