import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  contacts,
  InsertContact,
  pipelineStages,
  InsertPipelineStage,
  messages,
  InsertMessage,
  automations,
  InsertAutomation,
  aiAgents,
  InsertAiAgent,
  whatsappIntegrations,
  InsertWhatsappIntegration,
  consents,
  InsertConsent,
  auditLogs,
  InsertAuditLog,
  lgpdRequests,
  InsertLgpdRequest,
  organizations,
  InsertOrganization,
  organizationMembers,
  InsertOrganizationMember,
  subscriptionPlans,
  InsertSubscriptionPlan,
  subscriptions,
  InsertSubscription,
  payments,
  InsertPayment,
  usageLogs,
  InsertUsageLog,
  whatsappAccounts,
  InsertWhatsappAccount,
  whatsappConversations,
  InsertWhatsappConversation,
  whatsappMessages,
  InsertWhatsappMessage,
  whatsappTemplates,
  InsertWhatsappTemplate,
  whatsappWebhooks,
  InsertWhatsappWebhook,
  licenses,
  InsertLicense
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Pipeline Stages
export async function getPipelineStages(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(pipelineStages)
    .where(eq(pipelineStages.userId, userId))
    .orderBy(pipelineStages.order);
}

export async function createPipelineStage(stage: InsertPipelineStage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(pipelineStages).values(stage);
}

export async function updatePipelineStage(id: string, updates: Partial<InsertPipelineStage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(pipelineStages).set(updates).where(eq(pipelineStages.id, id));
}

export async function deletePipelineStage(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(pipelineStages).where(eq(pipelineStages.id, id));
}

// Contacts
export async function getContacts(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.updatedAt));
}

export async function getContactsByStage(userId: string, stageId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.userId, userId), eq(contacts.stageId, stageId)))
    .orderBy(desc(contacts.updatedAt));
}

export async function getContact(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(contacts).values(contact);
}

export async function updateContact(id: string, updates: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contacts).set(updates).where(eq(contacts.id, id));
}

export async function deleteContact(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(contacts).where(eq(contacts.id, id));
}

// Messages
export async function getMessagesByContact(contactId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.contactId, contactId))
    .orderBy(messages.createdAt);
}

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(messages).values(message);
}

// Automations
export async function getAutomations(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(automations)
    .where(eq(automations.userId, userId))
    .orderBy(desc(automations.createdAt));
}

export async function getAutomation(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(automations).where(eq(automations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAutomation(automation: InsertAutomation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(automations).values(automation);
}

export async function updateAutomation(id: string, updates: Partial<InsertAutomation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(automations).set(updates).where(eq(automations.id, id));
}

export async function deleteAutomation(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(automations).where(eq(automations.id, id));
}

// AI Agents
export async function getAiAgents(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(aiAgents)
    .where(eq(aiAgents.userId, userId))
    .orderBy(desc(aiAgents.createdAt));
}

export async function getAiAgent(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(aiAgents).where(eq(aiAgents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAiAgent(agent: InsertAiAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(aiAgents).values(agent);
}

export async function updateAiAgent(id: string, updates: Partial<InsertAiAgent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(aiAgents).set(updates).where(eq(aiAgents.id, id));
}

export async function deleteAiAgent(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(aiAgents).where(eq(aiAgents.id, id));
}

// WhatsApp Integrations
export async function getWhatsappIntegrations(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(whatsappIntegrations)
    .where(eq(whatsappIntegrations.userId, userId))
    .orderBy(desc(whatsappIntegrations.createdAt));
}

export async function getWhatsappIntegration(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappIntegrations).where(eq(whatsappIntegrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createWhatsappIntegration(integration: InsertWhatsappIntegration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappIntegrations).values(integration);
}

export async function updateWhatsappIntegration(id: string, updates: Partial<InsertWhatsappIntegration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappIntegrations).set(updates).where(eq(whatsappIntegrations.id, id));
}

export async function deleteWhatsappIntegration(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(whatsappIntegrations).where(eq(whatsappIntegrations.id, id));
}




// ============================================
// SECURITY & LGPD FUNCTIONS
// ============================================

/**
 * Create or update user consent
 */
export async function upsertConsent(consent: InsertConsent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(consents).values(consent).onDuplicateKeyUpdate({
    set: {
      accepted: consent.accepted,
      acceptedAt: consent.acceptedAt,
      revokedAt: consent.revokedAt,
      ipAddress: consent.ipAddress,
      userAgent: consent.userAgent,
    },
  });
}

/**
 * Get user consents
 */
export async function getUserConsents(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(consents).where(eq(consents.userId, userId));
}

/**
 * Check if user has accepted required consents
 */
export async function hasAcceptedConsents(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const userConsents = await db
    .select()
    .from(consents)
    .where(
      and(
        eq(consents.userId, userId),
        eq(consents.accepted, true)
      )
    );

  // Check if user has accepted both terms and privacy
  const hasTerms = userConsents.some(c => c.type === "terms" && !c.revokedAt);
  const hasPrivacy = userConsents.some(c => c.type === "privacy" && !c.revokedAt);

  return hasTerms && hasPrivacy;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(log: InsertAuditLog) {
  const db = await getDb();
  if (!db) {
    console.warn("[Audit] Database not available, skipping log");
    return;
  }

  try {
    await db.insert(auditLogs).values(log);
  } catch (error) {
    console.error("[Audit] Failed to create log:", error);
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs(options?: {
  userId?: string;
  action?: string;
  resource?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(auditLogs);

  if (options?.userId) {
    query = query.where(eq(auditLogs.userId, options.userId)) as any;
  }

  return await query
    .orderBy(desc(auditLogs.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);
}

/**
 * Create LGPD request (deletion, portability, correction)
 */
export async function createLgpdRequest(request: InsertLgpdRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(lgpdRequests).values(request);
}

/**
 * Get LGPD requests
 */
export async function getLgpdRequests(options?: {
  userId?: string;
  status?: "pending" | "processing" | "completed" | "rejected";
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(lgpdRequests);

  if (options?.userId) {
    query = query.where(eq(lgpdRequests.userId, options.userId)) as any;
  }

  if (options?.status) {
    query = query.where(eq(lgpdRequests.status, options.status)) as any;
  }

  return await query.orderBy(desc(lgpdRequests.requestedAt));
}

/**
 * Update LGPD request status
 */
export async function updateLgpdRequest(
  id: string,
  updates: {
    status?: "pending" | "processing" | "completed" | "rejected";
    completedAt?: Date;
    completedBy?: string;
    notes?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(lgpdRequests)
    .set(updates)
    .where(eq(lgpdRequests.id, id));
}




// ==================== ORGANIZATIONS ====================

export async function createOrganization(org: InsertOrganization) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(organizations).values(org);
  return org;
}

export async function getOrganization(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateOrganization(id: string, data: Partial<InsertOrganization>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(organizations)
    .set(data)
    .where(eq(organizations.id, id));
}

// Removed old duplicate functions - using new versions with better functionality below

// ==================== ORGANIZATION MEMBERS ====================

export async function addOrganizationMember(member: InsertOrganizationMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(organizationMembers).values(member);
}

export async function getOrganizationMembers(organizationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, organizationId));
}

export async function removeOrganizationMember(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(organizationMembers).where(eq(organizationMembers.id, id));
}

// ==================== SUBSCRIPTION PLANS ====================

export async function createSubscriptionPlan(plan: InsertSubscriptionPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(subscriptionPlans).values(plan);
  return plan;
}

export async function getAllSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}

export async function getSubscriptionPlan(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSubscriptionPlan(id: string, data: Partial<InsertSubscriptionPlan>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptionPlans).set(data).where(eq(subscriptionPlans.id, id));
}

// ==================== SUBSCRIPTIONS ====================

export async function createSubscription(sub: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(subscriptions).values(sub);
  return sub;
}

export async function getOrganizationSubscription(organizationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptions)
    .where(and(
      eq(subscriptions.organizationId, organizationId),
      eq(subscriptions.status, "active")
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSubscription(id: string, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

export async function cancelSubscription(id: string) {
  await updateSubscription(id, { 
    status: "cancelled",
    cancelledAt: new Date()
  });
}

// ==================== PAYMENTS ====================

export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(payments).values(payment);
  return payment;
}

export async function getOrganizationPayments(organizationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments)
    .where(eq(payments.organizationId, organizationId))
    .orderBy(desc(payments.createdAt));
}

export async function updatePayment(id: string, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(payments).set(data).where(eq(payments.id, id));
}

// ==================== USAGE LOGS ====================

export async function logUsage(log: InsertUsageLog) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(usageLogs).values(log);
}

export async function getOrganizationUsage(organizationId: string, metric?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (metric) {
    return await db.select().from(usageLogs)
      .where(and(
        eq(usageLogs.organizationId, organizationId),
        eq(usageLogs.metric, metric)
      ))
      .orderBy(desc(usageLogs.date));
  }
  
  return await db.select().from(usageLogs)
    .where(eq(usageLogs.organizationId, organizationId))
    .orderBy(desc(usageLogs.date));
}




// ==================== WHATSAPP ACCOUNTS ====================

export async function createWhatsappAccount(account: InsertWhatsappAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappAccounts).values(account);
  return account;
}

export async function getWhatsappAccount(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappAccounts).where(eq(whatsappAccounts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrganizationWhatsappAccounts(organizationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(whatsappAccounts)
    .where(eq(whatsappAccounts.organizationId, organizationId))
    .orderBy(desc(whatsappAccounts.createdAt));
}

export async function getDefaultWhatsappAccount(organizationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappAccounts)
    .where(and(
      eq(whatsappAccounts.organizationId, organizationId),
      eq(whatsappAccounts.isDefault, true),
      eq(whatsappAccounts.status, "connected")
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateWhatsappAccount(id: string, data: Partial<InsertWhatsappAccount>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappAccounts).set(data).where(eq(whatsappAccounts.id, id));
}

export async function deleteWhatsappAccount(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(whatsappAccounts).where(eq(whatsappAccounts.id, id));
}

// ==================== WHATSAPP CONVERSATIONS ====================

export async function createWhatsappConversation(conversation: InsertWhatsappConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappConversations).values(conversation);
  return conversation;
}

export async function getWhatsappConversation(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappConversations)
    .where(eq(whatsappConversations.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrganizationConversations(organizationId: string, status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (status) {
    return await db.select().from(whatsappConversations)
      .where(and(
        eq(whatsappConversations.organizationId, organizationId),
        eq(whatsappConversations.status, status as any)
      ))
      .orderBy(desc(whatsappConversations.lastMessageAt));
  }
  
  return await db.select().from(whatsappConversations)
    .where(eq(whatsappConversations.organizationId, organizationId))
    .orderBy(desc(whatsappConversations.lastMessageAt));
}

export async function updateWhatsappConversation(id: string, data: Partial<InsertWhatsappConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappConversations).set(data).where(eq(whatsappConversations.id, id));
}

// ==================== WHATSAPP MESSAGES ====================

export async function createWhatsappMessage(message: InsertWhatsappMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappMessages).values(message);
  return message;
}

export async function getConversationMessages(conversationId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(whatsappMessages)
    .where(eq(whatsappMessages.conversationId, conversationId))
    .orderBy(desc(whatsappMessages.createdAt))
    .limit(limit);
}

export async function updateWhatsappMessage(id: string, data: Partial<InsertWhatsappMessage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappMessages).set(data).where(eq(whatsappMessages.id, id));
}

// ==================== WHATSAPP TEMPLATES ====================

export async function createWhatsappTemplate(template: InsertWhatsappTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappTemplates).values(template);
  return template;
}

export async function getOrganizationTemplates(organizationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(whatsappTemplates)
    .where(eq(whatsappTemplates.organizationId, organizationId))
    .orderBy(desc(whatsappTemplates.createdAt));
}

export async function getApprovedTemplates(organizationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(whatsappTemplates)
    .where(and(
      eq(whatsappTemplates.organizationId, organizationId),
      eq(whatsappTemplates.status, "approved")
    ));
}

export async function updateWhatsappTemplate(id: string, data: Partial<InsertWhatsappTemplate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappTemplates).set(data).where(eq(whatsappTemplates.id, id));
}

// ==================== WHATSAPP WEBHOOKS ====================

export async function createWhatsappWebhook(webhook: InsertWhatsappWebhook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(whatsappWebhooks).values(webhook);
  return webhook;
}

export async function getWhatsappWebhook(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappWebhooks)
    .where(eq(whatsappWebhooks.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAccountWebhook(whatsappAccountId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(whatsappWebhooks)
    .where(eq(whatsappWebhooks.whatsappAccountId, whatsappAccountId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateWhatsappWebhook(id: string, data: Partial<InsertWhatsappWebhook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(whatsappWebhooks).set(data).where(eq(whatsappWebhooks.id, id));
}



// ==================== LICENSES ====================

export async function createLicense(license: InsertLicense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(licenses).values(license);
  return license;
}

export async function getLicense(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(licenses).where(eq(licenses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrganizationLicense(organizationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(licenses)
    .where(eq(licenses.organizationId, organizationId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLicense(id: string, data: Partial<InsertLicense>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(licenses).set(data).where(eq(licenses.id, id));
}

export async function suspendLicense(id: string, reason: string) {
  await updateLicense(id, {
    status: "suspended",
    reason: reason
  });
}

export async function activateLicense(id: string) {
  await updateLicense(id, {
    status: "active",
    reason: undefined
  });
}

export async function cancelLicense(id: string, reason: string) {
  await updateLicense(id, {
    status: "cancelled",
    reason: reason
  });
}

export async function expireLicense(id: string) {
  await updateLicense(id, {
    status: "expired"
  });
}

// ==================== ADMIN FUNCTIONS ====================

/**
 * Get all organizations (for admin dashboard)
 */
export async function getAllOrganizations(options?: {
  status?: "active" | "suspended" | "cancelled";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(organizations);
  
  if (options?.status) {
    query = query.where(eq(organizations.status, options.status)) as any;
  }
  
  return await query
    .orderBy(desc(organizations.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);
}

/**
 * Get organization with license info
 */
export async function getOrganizationWithLicense(organizationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const org = await db.select().from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);
  
  if (org.length === 0) return undefined;
  
  const license = await getOrganizationLicense(organizationId);
  const subscription = await getOrganizationSubscription(organizationId);
  const payments = await getOrganizationPayments(organizationId);
  
  return {
    ...org[0],
    license,
    subscription,
    recentPayments: payments.slice(0, 5)
  };
}

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  
  const allOrgs = await db.select().from(organizations);
  const activeOrgs = await db.select().from(organizations)
    .where(eq(organizations.status, "active"));
  const suspendedOrgs = await db.select().from(organizations)
    .where(eq(organizations.status, "suspended"));
  const cancelledOrgs = await db.select().from(organizations)
    .where(eq(organizations.status, "cancelled"));
  
  // Calculate total revenue
  const allPayments = await db.select().from(payments)
    .where(eq(payments.status, "paid"));
  
  const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalOrganizations: allOrgs.length,
    activeOrganizations: activeOrgs.length,
    suspendedOrganizations: suspendedOrgs.length,
    cancelledOrganizations: cancelledOrgs.length,
    totalRevenue: totalRevenue,
    totalUsers: allOrgs.reduce((sum, org) => sum + org.currentUsers, 0),
  };
}

/**
 * Suspend organization
 */
export async function suspendOrganization(organizationId: string, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update organization status
  await db.update(organizations)
    .set({ status: "suspended" })
    .where(eq(organizations.id, organizationId));
  
  // Suspend license
  const license = await getOrganizationLicense(organizationId);
  if (license) {
    await suspendLicense(license.id, reason);
  }
  
  // Log action
  await createAuditLog({
    id: `audit_${Date.now()}`,
    eventType: "organization_suspended",
    severity: "warning",
    userId: "system",
    organizationId,
    metadata: JSON.stringify({ reason }),
    timestamp: new Date(),
  });
}

/**
 * Activate organization
 */
export async function activateOrganization(organizationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update organization status
  await db.update(organizations)
    .set({ status: "active" })
    .where(eq(organizations.id, organizationId));
  
  // Activate license
  const license = await getOrganizationLicense(organizationId);
  if (license) {
    await activateLicense(license.id);
  }
  
  // Log action
  await createAuditLog({
    id: `audit_${Date.now()}`,
    eventType: "organization_activated",
    severity: "info",
    userId: "system",
    organizationId,
    metadata: null,
    timestamp: new Date(),
  });
}

/**
 * Cancel organization
 */
export async function cancelOrganization(organizationId: string, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update organization status
  await db.update(organizations)
    .set({ status: "cancelled" })
    .where(eq(organizations.id, organizationId));
  
  // Cancel license
  const license = await getOrganizationLicense(organizationId);
  if (license) {
    await cancelLicense(license.id, reason);
  }
  
  // Cancel subscription
  const subscription = await getOrganizationSubscription(organizationId);
  if (subscription) {
    await cancelSubscription(subscription.id);
  }
  
  // Log action
  await createAuditLog({
    id: `audit_${Date.now()}`,
    eventType: "organization_cancelled",
    severity: "warning",
    userId: "system",
    organizationId,
    metadata: JSON.stringify({ reason }),
    timestamp: new Date(),
  });
}

