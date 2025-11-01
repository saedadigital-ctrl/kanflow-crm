import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc.js";
import { TRPCError } from "@trpc/server";
import * as db from "../db.js";
import { nanoid } from "nanoid";
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
        });
    }
    return next({ ctx });
});
export const adminRouter = router({
    organizations: router({
        list: adminProcedure.query(async () => {
            return await db.getAllOrganizations();
        }),
        get: adminProcedure
            .input(z.object({ id: z.string() }))
            .query(async ({ input }) => {
            const org = await db.getOrganization(input.id);
            if (!org) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Organização não encontrada' });
            }
            return org;
        }),
        create: adminProcedure
            .input(z.object({
            name: z.string().min(1),
            slug: z.string().min(1),
            ownerId: z.string(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            cnpj: z.string().optional(),
            address: z.string().optional(),
            maxUsers: z.number().default(5),
            maxContacts: z.number().default(1000),
            maxWhatsappNumbers: z.number().default(1),
            trialEndsAt: z.date().optional(),
        }))
            .mutation(async ({ input }) => {
            const org = await db.createOrganization({
                id: nanoid(),
                ...input,
                status: "active",
                currentUsers: 1,
            });
            return org;
        }),
        update: adminProcedure
            .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            cnpj: z.string().optional(),
            address: z.string().optional(),
            maxUsers: z.number().optional(),
            maxContacts: z.number().optional(),
            maxWhatsappNumbers: z.number().optional(),
        }))
            .mutation(async ({ input }) => {
            const { id, ...data } = input;
            await db.updateOrganization(id, data);
            return { success: true };
        }),
        suspend: adminProcedure
            .input(z.object({ id: z.string(), reason: z.string().optional() }))
            .mutation(async ({ input }) => {
            await db.suspendOrganization(input.id, input.reason || 'Suspensão administrativa');
            return { success: true, message: 'Organização suspensa com sucesso' };
        }),
        activate: adminProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.activateOrganization(input.id);
            return { success: true, message: 'Organização ativada com sucesso' };
        }),
        cancel: adminProcedure
            .input(z.object({ id: z.string(), reason: z.string().optional() }))
            .mutation(async ({ input }) => {
            await db.cancelOrganization(input.id, input.reason || 'Cancelamento administrativo');
            return { success: true, message: 'Organização cancelada com sucesso' };
        }),
        members: adminProcedure
            .input(z.object({ organizationId: z.string() }))
            .query(async ({ input }) => {
            return await db.getOrganizationMembers(input.organizationId);
        }),
    }),
    plans: router({
        list: adminProcedure.query(async () => {
            return await db.getAllSubscriptionPlans();
        }),
        create: adminProcedure
            .input(z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            price: z.number().min(0),
            billingCycle: z.enum(["monthly", "quarterly", "yearly"]),
            maxUsers: z.number().min(1),
            maxContacts: z.number().min(1),
            maxWhatsappNumbers: z.number().min(1),
            features: z.string().optional(),
        }))
            .mutation(async ({ input }) => {
            const plan = await db.createSubscriptionPlan({
                id: nanoid(),
                ...input,
                isActive: true,
            });
            return plan;
        }),
        update: adminProcedure
            .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().optional(),
            maxUsers: z.number().optional(),
            maxContacts: z.number().optional(),
            maxWhatsappNumbers: z.number().optional(),
            features: z.string().optional(),
            isActive: z.boolean().optional(),
        }))
            .mutation(async ({ input }) => {
            const { id, ...data } = input;
            await db.updateSubscriptionPlan(id, data);
            return { success: true };
        }),
    }),
    subscriptions: router({
        create: adminProcedure
            .input(z.object({
            organizationId: z.string(),
            planId: z.string(),
            currentPeriodStart: z.date(),
            currentPeriodEnd: z.date(),
        }))
            .mutation(async ({ input }) => {
            const sub = await db.createSubscription({
                id: nanoid(),
                ...input,
                status: "active",
                cancelAtPeriodEnd: false,
            });
            return sub;
        }),
        cancel: adminProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.cancelSubscription(input.id);
            return { success: true, message: 'Assinatura cancelada com sucesso' };
        }),
        getByOrganization: adminProcedure
            .input(z.object({ organizationId: z.string() }))
            .query(async ({ input }) => {
            return await db.getOrganizationSubscription(input.organizationId);
        }),
    }),
    payments: router({
        list: adminProcedure
            .input(z.object({ organizationId: z.string() }))
            .query(async ({ input }) => {
            return await db.getOrganizationPayments(input.organizationId);
        }),
        create: adminProcedure
            .input(z.object({
            organizationId: z.string(),
            subscriptionId: z.string(),
            amount: z.number(),
            paymentMethod: z.string().optional(),
            dueDate: z.date(),
        }))
            .mutation(async ({ input }) => {
            const payment = await db.createPayment({
                id: nanoid(),
                ...input,
                status: "pending",
            });
            return payment;
        }),
        markAsPaid: adminProcedure
            .input(z.object({
            id: z.string(),
            transactionId: z.string().optional(),
        }))
            .mutation(async ({ input }) => {
            await db.updatePayment(input.id, {
                status: "paid",
                paidAt: new Date(),
                transactionId: input.transactionId,
            });
            return { success: true, message: 'Pagamento marcado como pago' };
        }),
        markAsFailed: adminProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ input }) => {
            await db.updatePayment(input.id, { status: "failed" });
            return { success: true, message: 'Pagamento marcado como falhou' };
        }),
    }),
    usage: router({
        getByOrganization: adminProcedure
            .input(z.object({
            organizationId: z.string(),
            metric: z.string().optional(),
        }))
            .query(async ({ input }) => {
            return await db.getOrganizationUsage(input.organizationId, input.metric);
        }),
    }),
    stats: adminProcedure.query(async () => {
        const allOrgs = await db.getAllOrganizations();
        const activeOrgs = allOrgs.filter(o => o.status === 'active').length;
        const suspendedOrgs = allOrgs.filter(o => o.status === 'suspended').length;
        const cancelledOrgs = allOrgs.filter(o => o.status === 'cancelled').length;
        const totalUsers = allOrgs.reduce((sum, org) => sum + (org.currentUsers || 0), 0);
        const totalRevenue = 0;
        return {
            totalOrganizations: allOrgs.length,
            activeOrganizations: activeOrgs,
            suspendedOrganizations: suspendedOrgs,
            cancelledOrganizations: cancelledOrgs,
            totalUsers,
            totalRevenue,
        };
    }),
});
