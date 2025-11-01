import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, contacts, pipelineStages, messages, automations, aiAgents, whatsappIntegrations, consents, auditLogs, lgpdRequests, organizations, organizationMembers, subscriptionPlans, subscriptions, payments, usageLogs, whatsappAccounts, whatsappConversations, whatsappMessages, whatsappTemplates, whatsappWebhooks, licenses } from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";
let _db = null;
export async function getDb() {
    if (!_db && process.env.DATABASE_URL) {
        try {
            _db = drizzle(process.env.DATABASE_URL);
        }
        catch (error) {
            console.warn("[Database] Failed to connect:", error);
            _db = null;
        }
    }
    return _db;
}
export async function upsertUser(user) {
    if (!user.id) {
        throw new Error("User ID is required for upsert");
    }
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot upsert user: database not available");
        return;
    }
    try {
        const values = {
            id: user.id,
        };
        const updateSet = {};
        const textFields = ["name", "email", "loginMethod"];
        const assignNullable = (field) => {
            const value = user[field];
            if (value === undefined)
                return;
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
    }
    catch (error) {
        console.error("[Database] Failed to upsert user:", error);
        throw error;
    }
}
export async function getUser(id) {
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot get user: database not available");
        return undefined;
    }
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getPipelineStages(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(pipelineStages)
        .where(eq(pipelineStages.userId, userId))
        .orderBy(pipelineStages.order);
}
export async function createPipelineStage(stage) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(pipelineStages).values(stage);
}
export async function updatePipelineStage(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(pipelineStages).set(updates).where(eq(pipelineStages.id, id));
}
export async function deletePipelineStage(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(pipelineStages).where(eq(pipelineStages.id, id));
}
export async function getContacts(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .orderBy(desc(contacts.updatedAt));
}
export async function getContactsByStage(userId, stageId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(contacts)
        .where(and(eq(contacts.userId, userId), eq(contacts.stageId, stageId)))
        .orderBy(desc(contacts.updatedAt));
}
export async function getContact(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createContact(contact) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(contacts).values(contact);
}
export async function updateContact(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(contacts).set(updates).where(eq(contacts.id, id));
}
export async function deleteContact(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(contacts).where(eq(contacts.id, id));
}
export async function getMessagesByContact(contactId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(messages)
        .where(eq(messages.contactId, contactId))
        .orderBy(messages.createdAt);
}
export async function createMessage(message) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(messages).values(message);
}
export async function getAutomations(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(automations)
        .where(eq(automations.userId, userId))
        .orderBy(desc(automations.createdAt));
}
export async function getAutomation(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(automations).where(eq(automations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createAutomation(automation) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(automations).values(automation);
}
export async function updateAutomation(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(automations).set(updates).where(eq(automations.id, id));
}
export async function deleteAutomation(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(automations).where(eq(automations.id, id));
}
export async function getAiAgents(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(aiAgents)
        .where(eq(aiAgents.userId, userId))
        .orderBy(desc(aiAgents.createdAt));
}
export async function getAiAgent(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(aiAgents).where(eq(aiAgents.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createAiAgent(agent) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(aiAgents).values(agent);
}
export async function updateAiAgent(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(aiAgents).set(updates).where(eq(aiAgents.id, id));
}
export async function deleteAiAgent(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(aiAgents).where(eq(aiAgents.id, id));
}
export async function getWhatsappIntegrations(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db
        .select()
        .from(whatsappIntegrations)
        .where(eq(whatsappIntegrations.userId, userId))
        .orderBy(desc(whatsappIntegrations.createdAt));
}
export async function getWhatsappIntegration(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappIntegrations).where(eq(whatsappIntegrations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function createWhatsappIntegration(integration) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappIntegrations).values(integration);
}
export async function updateWhatsappIntegration(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappIntegrations).set(updates).where(eq(whatsappIntegrations.id, id));
}
export async function deleteWhatsappIntegration(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(whatsappIntegrations).where(eq(whatsappIntegrations.id, id));
}
export async function upsertConsent(consent) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
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
export async function getUserConsents(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(consents).where(eq(consents.userId, userId));
}
export async function hasAcceptedConsents(userId) {
    const db = await getDb();
    if (!db)
        return false;
    const userConsents = await db
        .select()
        .from(consents)
        .where(and(eq(consents.userId, userId), eq(consents.accepted, true)));
    const hasTerms = userConsents.some(c => c.type === "terms" && !c.revokedAt);
    const hasPrivacy = userConsents.some(c => c.type === "privacy" && !c.revokedAt);
    return hasTerms && hasPrivacy;
}
export async function createAuditLog(log) {
    const db = await getDb();
    if (!db) {
        console.warn("[Audit] Database not available, skipping log");
        return;
    }
    try {
        await db.insert(auditLogs).values(log);
    }
    catch (error) {
        console.error("[Audit] Failed to create log:", error);
    }
}
export async function getAuditLogs(options) {
    const db = await getDb();
    if (!db)
        return [];
    let query = db.select().from(auditLogs);
    if (options?.userId) {
        query = query.where(eq(auditLogs.userId, options.userId));
    }
    return await query
        .orderBy(desc(auditLogs.createdAt))
        .limit(options?.limit || 50)
        .offset(options?.offset || 0);
}
export async function createLgpdRequest(request) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return await db.insert(lgpdRequests).values(request);
}
export async function getLgpdRequests(options) {
    const db = await getDb();
    if (!db)
        return [];
    let query = db.select().from(lgpdRequests);
    if (options?.userId) {
        query = query.where(eq(lgpdRequests.userId, options.userId));
    }
    if (options?.status) {
        query = query.where(eq(lgpdRequests.status, options.status));
    }
    return await query.orderBy(desc(lgpdRequests.requestedAt));
}
export async function updateLgpdRequest(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return await db
        .update(lgpdRequests)
        .set(updates)
        .where(eq(lgpdRequests.id, id));
}
export async function createOrganization(org) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(organizations).values(org);
    return org;
}
export async function getOrganization(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateOrganization(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(organizations)
        .set(data)
        .where(eq(organizations.id, id));
}
export async function addOrganizationMember(member) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(organizationMembers).values(member);
}
export async function getOrganizationMembers(organizationId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, organizationId));
}
export async function removeOrganizationMember(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(organizationMembers).where(eq(organizationMembers.id, id));
}
export async function createSubscriptionPlan(plan) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(subscriptionPlans).values(plan);
    return plan;
}
export async function getAllSubscriptionPlans() {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}
export async function getSubscriptionPlan(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateSubscriptionPlan(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(subscriptionPlans).set(data).where(eq(subscriptionPlans.id, id));
}
export async function createSubscription(sub) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(subscriptions).values(sub);
    return sub;
}
export async function getOrganizationSubscription(organizationId) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(subscriptions)
        .where(and(eq(subscriptions.organizationId, organizationId), eq(subscriptions.status, "active")))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateSubscription(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}
export async function cancelSubscription(id) {
    await updateSubscription(id, {
        status: "cancelled",
        cancelledAt: new Date()
    });
}
export async function createPayment(payment) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(payments).values(payment);
    return payment;
}
export async function getOrganizationPayments(organizationId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(payments)
        .where(eq(payments.organizationId, organizationId))
        .orderBy(desc(payments.createdAt));
}
export async function updatePayment(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(payments).set(data).where(eq(payments.id, id));
}
export async function logUsage(log) {
    const db = await getDb();
    if (!db)
        return;
    await db.insert(usageLogs).values(log);
}
export async function getOrganizationUsage(organizationId, metric) {
    const db = await getDb();
    if (!db)
        return [];
    if (metric) {
        return await db.select().from(usageLogs)
            .where(and(eq(usageLogs.organizationId, organizationId), eq(usageLogs.metric, metric)))
            .orderBy(desc(usageLogs.date));
    }
    return await db.select().from(usageLogs)
        .where(eq(usageLogs.organizationId, organizationId))
        .orderBy(desc(usageLogs.date));
}
export async function createWhatsappAccount(account) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappAccounts).values(account);
    return account;
}
export async function getWhatsappAccount(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappAccounts).where(eq(whatsappAccounts.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getOrganizationWhatsappAccounts(organizationId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(whatsappAccounts)
        .where(eq(whatsappAccounts.organizationId, organizationId))
        .orderBy(desc(whatsappAccounts.createdAt));
}
export async function getDefaultWhatsappAccount(organizationId) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappAccounts)
        .where(and(eq(whatsappAccounts.organizationId, organizationId), eq(whatsappAccounts.isDefault, true), eq(whatsappAccounts.status, "connected")))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateWhatsappAccount(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappAccounts).set(data).where(eq(whatsappAccounts.id, id));
}
export async function deleteWhatsappAccount(id) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.delete(whatsappAccounts).where(eq(whatsappAccounts.id, id));
}
export async function createWhatsappConversation(conversation) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappConversations).values(conversation);
    return conversation;
}
export async function getWhatsappConversation(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappConversations)
        .where(eq(whatsappConversations.id, id))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getOrganizationConversations(organizationId, status) {
    const db = await getDb();
    if (!db)
        return [];
    if (status) {
        return await db.select().from(whatsappConversations)
            .where(and(eq(whatsappConversations.organizationId, organizationId), eq(whatsappConversations.status, status)))
            .orderBy(desc(whatsappConversations.lastMessageAt));
    }
    return await db.select().from(whatsappConversations)
        .where(eq(whatsappConversations.organizationId, organizationId))
        .orderBy(desc(whatsappConversations.lastMessageAt));
}
export async function updateWhatsappConversation(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappConversations).set(data).where(eq(whatsappConversations.id, id));
}
export async function createWhatsappMessage(message) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappMessages).values(message);
    return message;
}
export async function getConversationMessages(conversationId, limit = 50) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(whatsappMessages)
        .where(eq(whatsappMessages.conversationId, conversationId))
        .orderBy(desc(whatsappMessages.createdAt))
        .limit(limit);
}
export async function updateWhatsappMessage(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappMessages).set(data).where(eq(whatsappMessages.id, id));
}
export async function createWhatsappTemplate(template) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappTemplates).values(template);
    return template;
}
export async function getOrganizationTemplates(organizationId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(whatsappTemplates)
        .where(eq(whatsappTemplates.organizationId, organizationId))
        .orderBy(desc(whatsappTemplates.createdAt));
}
export async function getApprovedTemplates(organizationId) {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(whatsappTemplates)
        .where(and(eq(whatsappTemplates.organizationId, organizationId), eq(whatsappTemplates.status, "approved")));
}
export async function updateWhatsappTemplate(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappTemplates).set(data).where(eq(whatsappTemplates.id, id));
}
export async function createWhatsappWebhook(webhook) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(whatsappWebhooks).values(webhook);
    return webhook;
}
export async function getWhatsappWebhook(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappWebhooks)
        .where(eq(whatsappWebhooks.id, id))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getAccountWebhook(whatsappAccountId) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(whatsappWebhooks)
        .where(eq(whatsappWebhooks.whatsappAccountId, whatsappAccountId))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateWhatsappWebhook(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(whatsappWebhooks).set(data).where(eq(whatsappWebhooks.id, id));
}
export async function createLicense(license) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(licenses).values(license);
    return license;
}
export async function getLicense(id) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(licenses).where(eq(licenses.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function getOrganizationLicense(organizationId) {
    const db = await getDb();
    if (!db)
        return undefined;
    const result = await db.select().from(licenses)
        .where(eq(licenses.organizationId, organizationId))
        .limit(1);
    return result.length > 0 ? result[0] : undefined;
}
export async function updateLicense(id, data) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(licenses).set(data).where(eq(licenses.id, id));
}
export async function suspendLicense(id, reason) {
    await updateLicense(id, {
        status: "suspended",
        reason: reason
    });
}
export async function activateLicense(id) {
    await updateLicense(id, {
        status: "active",
        reason: undefined
    });
}
export async function cancelLicense(id, reason) {
    await updateLicense(id, {
        status: "cancelled",
        reason: reason
    });
}
export async function expireLicense(id) {
    await updateLicense(id, {
        status: "expired"
    });
}
export async function getAllOrganizations(options) {
    const db = await getDb();
    if (!db)
        return [];
    let query = db.select().from(organizations);
    if (options?.status) {
        query = query.where(eq(organizations.status, options.status));
    }
    return await query
        .orderBy(desc(organizations.createdAt))
        .limit(options?.limit || 50)
        .offset(options?.offset || 0);
}
export async function getOrganizationWithLicense(organizationId) {
    const db = await getDb();
    if (!db)
        return undefined;
    const org = await db.select().from(organizations)
        .where(eq(organizations.id, organizationId))
        .limit(1);
    if (org.length === 0)
        return undefined;
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
export async function getAdminDashboardStats() {
    const db = await getDb();
    if (!db)
        return null;
    const allOrgs = await db.select().from(organizations);
    const activeOrgs = await db.select().from(organizations)
        .where(eq(organizations.status, "active"));
    const suspendedOrgs = await db.select().from(organizations)
        .where(eq(organizations.status, "suspended"));
    const cancelledOrgs = await db.select().from(organizations)
        .where(eq(organizations.status, "cancelled"));
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
export async function suspendOrganization(organizationId, reason) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(organizations)
        .set({ status: "suspended" })
        .where(eq(organizations.id, organizationId));
    const license = await getOrganizationLicense(organizationId);
    if (license) {
        await suspendLicense(license.id, reason);
    }
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
export async function activateOrganization(organizationId) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(organizations)
        .set({ status: "active" })
        .where(eq(organizations.id, organizationId));
    const license = await getOrganizationLicense(organizationId);
    if (license) {
        await activateLicense(license.id);
    }
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
export async function cancelOrganization(organizationId, reason) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(organizations)
        .set({ status: "cancelled" })
        .where(eq(organizations.id, organizationId));
    const license = await getOrganizationLicense(organizationId);
    if (license) {
        await cancelLicense(license.id, reason);
    }
    const subscription = await getOrganizationSubscription(organizationId);
    if (subscription) {
        await cancelSubscription(subscription.id);
    }
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
