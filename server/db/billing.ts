import { eq, and } from "drizzle-orm";
import { subscriptions, invoices, paymentMethods, usage } from "../../drizzle/schema";
import { getDb } from "../db";
import { randomUUID } from "crypto";

/**
 * Obter subscription da organização
 */
export async function getSubscription(organizationId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId));

  return result.length > 0 ? result[0] : null;
}

/**
 * Criar subscription
 */
export async function createSubscription(
  organizationId: string,
  data: {
    plan: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    trialEndsAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = randomUUID();
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

  await db.insert(subscriptions).values({
    id,
    organizationId,
    plan: data.plan,
    status: "active",
    stripeSubscriptionId: data.stripeSubscriptionId,
    stripeCustomerId: data.stripeCustomerId,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    trialEndsAt: data.trialEndsAt,
  });

  return { id, organizationId, plan: data.plan };
}

/**
 * Atualizar subscription
 */
export async function updateSubscription(
  organizationId: string,
  data: Partial<{
    plan: string;
    status: string;
    currentPeriodEnd: Date;
    canceledAt: Date;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.organizationId, organizationId));

  return { organizationId, ...data };
}

/**
 * Cancelar subscription
 */
export async function cancelSubscription(organizationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
    })
    .where(eq(subscriptions.organizationId, organizationId));

  return { organizationId, status: "canceled" };
}

/**
 * Listar invoices da organização
 */
export async function getInvoices(organizationId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(invoices)
    .where(eq(invoices.organizationId, organizationId));

  return result;
}

/**
 * Criar invoice
 */
export async function createInvoice(
  organizationId: string,
  data: {
    subscriptionId?: string;
    stripeInvoiceId?: string;
    amount: number;
    currency?: string;
    dueDate?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = randomUUID();
  await db.insert(invoices).values({
    id,
    organizationId,
    subscriptionId: data.subscriptionId,
    stripeInvoiceId: data.stripeInvoiceId,
    amount: data.amount,
    currency: data.currency || "USD",
    status: "draft",
    dueDate: data.dueDate,
  });

  return { id, organizationId, amount: data.amount };
}

/**
 * Marcar invoice como paga
 */
export async function markInvoiceAsPaid(invoiceId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(invoices)
    .set({
      status: "paid",
      paidAt: new Date(),
    })
    .where(eq(invoices.id, invoiceId));

  return { invoiceId, status: "paid" };
}

/**
 * Listar payment methods
 */
export async function getPaymentMethods(organizationId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.organizationId, organizationId));

  return result;
}

/**
 * Adicionar payment method
 */
export async function addPaymentMethod(
  organizationId: string,
  data: {
    stripePaymentMethodId: string;
    type: string;
    brand?: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = randomUUID();
  await db.insert(paymentMethods).values({
    id,
    organizationId,
    stripePaymentMethodId: data.stripePaymentMethodId,
    type: data.type,
    brand: data.brand,
    last4: data.last4,
    expiryMonth: data.expiryMonth,
    expiryYear: data.expiryYear,
    isDefault: true,
  });

  return { id, organizationId, type: data.type };
}

/**
 * Remover payment method
 */
export async function removePaymentMethod(
  organizationId: string,
  paymentMethodId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(paymentMethods)
    .where(
      and(
        eq(paymentMethods.organizationId, organizationId),
        eq(paymentMethods.id, paymentMethodId)
      )
    );

  return { paymentMethodId };
}

/**
 * Obter usage do mês
 */
export async function getMonthlyUsage(organizationId: string, month: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(usage)
    .where(
      and(
        eq(usage.organizationId, organizationId),
        eq(usage.month, month)
      )
    );

  return result.length > 0 ? result[0] : null;
}

/**
 * Atualizar usage
 */
export async function updateUsage(
  organizationId: string,
  month: string,
  data: {
    contactsCount?: number;
    messagesCount?: number;
    conversationsCount?: number;
    usersCount?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getMonthlyUsage(organizationId, month);

  if (existing) {
    await db
      .update(usage)
      .set(data)
      .where(
        and(
          eq(usage.organizationId, organizationId),
          eq(usage.month, month)
        )
      );
  } else {
    const id = randomUUID();
    await db.insert(usage).values({
      id,
      organizationId,
      month,
      ...data,
    });
  }

  return { organizationId, month, ...data };
}

/**
 * Calcular limite de recursos baseado no plano
 */
export function getPlanLimits(plan: string) {
  const limits: Record<string, { maxUsers: number; maxContacts: number; maxConversations: number }> = {
    starter: {
      maxUsers: 3,
      maxContacts: 500,
      maxConversations: 5000,
    },
    professional: {
      maxUsers: 10,
      maxContacts: 5000,
      maxConversations: 50000,
    },
    enterprise: {
      maxUsers: 999,
      maxContacts: 999999,
      maxConversations: 999999,
    },
  };

  return limits[plan] || limits.starter;
}

/**
 * Verificar se organização atingiu limite
 */
export async function checkUsageLimit(
  organizationId: string,
  month: string,
  plan: string
) {
  const monthlyUsage = await getMonthlyUsage(organizationId, month);
  const limits = getPlanLimits(plan);

  if (!monthlyUsage) {
    return { exceeded: false, details: {} };
  }

  const exceeded = {
    users: (monthlyUsage.usersCount || 0) >= limits.maxUsers,
    contacts: (monthlyUsage.contactsCount || 0) >= limits.maxContacts,
    conversations: (monthlyUsage.conversationsCount || 0) >= limits.maxConversations,
  };

  return {
    exceeded: Object.values(exceeded).some(e => e),
    details: exceeded,
    usage: monthlyUsage,
    limits,
  };
}

