import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getInvoices,
  createInvoice,
  markInvoiceAsPaid,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getMonthlyUsage,
  updateUsage,
  checkUsageLimit,
  getPlanLimits,
} from "../db/billing";

// Schemas
const planSchema = z.enum(["starter", "professional", "enterprise"]);

export const billingRouter = router({
  // ============================================
  // SUBSCRIPTIONS
  // ============================================

  subscription: router({
    /**
     * Obter subscription atual
     */
    get: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ input }) => {
        try {
          const subscription = await getSubscription(input.organizationId);
          return {
            success: true,
            data: subscription,
          };
        } catch (error) {
          console.error("[billing.subscription.get] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao obter subscription",
          });
        }
      }),

    /**
     * Criar subscription
     */
    create: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          plan: planSchema,
          trialEndsAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const subscription = await createSubscription(
            input.organizationId,
            {
              plan: input.plan,
              trialEndsAt: input.trialEndsAt,
            }
          );
          return {
            success: true,
            data: subscription,
            message: "Subscription criada com sucesso",
          };
        } catch (error) {
          console.error("[billing.subscription.create] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao criar subscription",
          });
        }
      }),

    /**
     * Atualizar plano
     */
    updatePlan: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          plan: planSchema,
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await updateSubscription(input.organizationId, {
            plan: input.plan,
          });
          return {
            success: true,
            data: result,
            message: "Plano atualizado com sucesso",
          };
        } catch (error) {
          console.error("[billing.subscription.updatePlan] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao atualizar plano",
          });
        }
      }),

    /**
     * Cancelar subscription
     */
    cancel: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const result = await cancelSubscription(input.organizationId);
          return {
            success: true,
            data: result,
            message: "Subscription cancelada com sucesso",
          };
        } catch (error) {
          console.error("[billing.subscription.cancel] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao cancelar subscription",
          });
        }
      }),
  }),

  // ============================================
  // INVOICES
  // ============================================

  invoices: router({
    /**
     * Listar invoices
     */
    list: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ input }) => {
        try {
          const invoices = await getInvoices(input.organizationId);
          return {
            success: true,
            data: invoices,
          };
        } catch (error) {
          console.error("[billing.invoices.list] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao listar invoices",
          });
        }
      }),

    /**
     * Criar invoice
     */
    create: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          subscriptionId: z.string().optional(),
          amount: z.number(),
          currency: z.string().optional(),
          dueDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const invoice = await createInvoice(input.organizationId, {
            subscriptionId: input.subscriptionId,
            amount: input.amount,
            currency: input.currency,
            dueDate: input.dueDate,
          });
          return {
            success: true,
            data: invoice,
            message: "Invoice criada com sucesso",
          };
        } catch (error) {
          console.error("[billing.invoices.create] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao criar invoice",
          });
        }
      }),

    /**
     * Marcar como paga
     */
    markAsPaid: protectedProcedure
      .input(z.object({ invoiceId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const result = await markInvoiceAsPaid(input.invoiceId);
          return {
            success: true,
            data: result,
            message: "Invoice marcada como paga",
          };
        } catch (error) {
          console.error("[billing.invoices.markAsPaid] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao marcar invoice como paga",
          });
        }
      }),
  }),

  // ============================================
  // PAYMENT METHODS
  // ============================================

  paymentMethods: router({
    /**
     * Listar payment methods
     */
    list: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ input }) => {
        try {
          const methods = await getPaymentMethods(input.organizationId);
          return {
            success: true,
            data: methods,
          };
        } catch (error) {
          console.error("[billing.paymentMethods.list] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao listar payment methods",
          });
        }
      }),

    /**
     * Adicionar payment method
     */
    add: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          stripePaymentMethodId: z.string(),
          type: z.string(),
          brand: z.string().optional(),
          last4: z.string().optional(),
          expiryMonth: z.number().optional(),
          expiryYear: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const method = await addPaymentMethod(input.organizationId, {
            stripePaymentMethodId: input.stripePaymentMethodId,
            type: input.type,
            brand: input.brand,
            last4: input.last4,
            expiryMonth: input.expiryMonth,
            expiryYear: input.expiryYear,
          });
          return {
            success: true,
            data: method,
            message: "Payment method adicionado com sucesso",
          };
        } catch (error) {
          console.error("[billing.paymentMethods.add] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao adicionar payment method",
          });
        }
      }),

    /**
     * Remover payment method
     */
    remove: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          paymentMethodId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await removePaymentMethod(
            input.organizationId,
            input.paymentMethodId
          );
          return {
            success: true,
            data: result,
            message: "Payment method removido com sucesso",
          };
        } catch (error) {
          console.error("[billing.paymentMethods.remove] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao remover payment method",
          });
        }
      }),
  }),

  // ============================================
  // USAGE & LIMITS
  // ============================================

  usage: router({
    /**
     * Obter usage do mês
     */
    get: protectedProcedure
      .input(z.object({ organizationId: z.string(), month: z.string() }))
      .query(async ({ input }) => {
        try {
          const monthlyUsage = await getMonthlyUsage(
            input.organizationId,
            input.month
          );
          return {
            success: true,
            data: monthlyUsage,
          };
        } catch (error) {
          console.error("[billing.usage.get] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao obter usage",
          });
        }
      }),

    /**
     * Atualizar usage
     */
    update: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          month: z.string(),
          contactsCount: z.number().optional(),
          messagesCount: z.number().optional(),
          conversationsCount: z.number().optional(),
          usersCount: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await updateUsage(
            input.organizationId,
            input.month,
            {
              contactsCount: input.contactsCount,
              messagesCount: input.messagesCount,
              conversationsCount: input.conversationsCount,
              usersCount: input.usersCount,
            }
          );
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          console.error("[billing.usage.update] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao atualizar usage",
          });
        }
      }),

    /**
     * Verificar limites
     */
    checkLimits: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          month: z.string(),
          plan: planSchema,
        })
      )
      .query(async ({ input }) => {
        try {
          const result = await checkUsageLimit(
            input.organizationId,
            input.month,
            input.plan
          );
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          console.error("[billing.usage.checkLimits] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao verificar limites",
          });
        }
      }),
  }),

  // ============================================
  // PLANS
  // ============================================

  plans: router({
    /**
     * Listar planos disponíveis
     */
    list: protectedProcedure.query(async () => {
      try {
        const plans = [
          {
            id: "starter",
            name: "Starter",
            price: 29,
            currency: "USD",
            billingPeriod: "month",
            features: [
              "Até 3 usuários",
              "500 contatos",
              "5.000 conversas",
              "Suporte por email",
            ],
            limits: getPlanLimits("starter"),
          },
          {
            id: "professional",
            name: "Professional",
            price: 99,
            currency: "USD",
            billingPeriod: "month",
            features: [
              "Até 10 usuários",
              "5.000 contatos",
              "50.000 conversas",
              "Suporte prioritário",
              "Webhooks",
            ],
            limits: getPlanLimits("professional"),
          },
          {
            id: "enterprise",
            name: "Enterprise",
            price: 299,
            currency: "USD",
            billingPeriod: "month",
            features: [
              "Usuários ilimitados",
              "Contatos ilimitados",
              "Conversas ilimitadas",
              "Suporte 24/7",
              "API customizada",
              "SLA garantido",
            ],
            limits: getPlanLimits("enterprise"),
          },
        ];

        return {
          success: true,
          data: plans,
        };
      } catch (error) {
        console.error("[billing.plans.list] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao listar planos",
        });
      }
    }),

    /**
     * Obter detalhes de um plano
     */
    get: protectedProcedure
      .input(z.object({ planId: z.string() }))
      .query(async ({ input }) => {
        try {
          const limits = getPlanLimits(input.planId);
          return {
            success: true,
            data: { planId: input.planId, limits },
          };
        } catch (error) {
          console.error("[billing.plans.get] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao obter plano",
          });
        }
      }),
  }),
});

