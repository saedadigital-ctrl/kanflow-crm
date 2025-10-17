import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pipeline stages for the Kanban board (funil de vendas)
 */
export const pipelineStages = mysqlTable("pipeline_stages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").notNull(),
  color: varchar("color", { length: 7 }).default("#3b82f6"), // hex color
  userId: varchar("userId", { length: 64 }).notNull(), // owner of this stage
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type PipelineStage = typeof pipelineStages.$inferSelect;
export type InsertPipelineStage = typeof pipelineStages.$inferInsert;

/**
 * Contacts from WhatsApp
 */
export const contacts = mysqlTable("contacts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  avatarUrl: text("avatarUrl"),
  notes: text("notes"),
  tags: text("tags"), // JSON array of tags
  stageId: varchar("stageId", { length: 64 }), // current pipeline stage
  userId: varchar("userId", { length: 64 }).notNull(), // owner
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * WhatsApp messages
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contactId: varchar("contactId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  direction: mysqlEnum("direction", ["inbound", "outbound"]).notNull(),
  status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).default("sent"),
  mediaUrl: text("mediaUrl"), // for images, videos, etc
  mediaType: varchar("mediaType", { length: 50 }), // image, video, audio, document
  sentBy: varchar("sentBy", { length: 64 }), // user id or "ai" for AI agent
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * WhatsApp integration settings
 */
export const whatsappIntegrations = mysqlTable("whatsapp_integrations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  businessAccountId: varchar("businessAccountId", { length: 255 }),
  accessToken: text("accessToken"), // encrypted
  webhookVerifyToken: varchar("webhookVerifyToken", { length: 255 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappIntegration = typeof whatsappIntegrations.$inferSelect;
export type InsertWhatsappIntegration = typeof whatsappIntegrations.$inferInsert;

/**
 * Automation rules
 */
export const automations = mysqlTable("automations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 100 }).notNull(), // new_message, stage_change, keyword_match, etc
  triggerConfig: text("triggerConfig"), // JSON config for trigger
  action: varchar("action", { length: 100 }).notNull(), // send_message, move_stage, assign_tag, ai_response, etc
  actionConfig: text("actionConfig"), // JSON config for action
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;

/**
 * AI Agent configurations
 */
export const aiAgents = mysqlTable("ai_agents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  systemPrompt: text("systemPrompt").notNull(),
  temperature: int("temperature").default(70), // 0-100 scale
  isActive: boolean("isActive").default(true),
  autoReply: boolean("autoReply").default(false), // auto reply to messages
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type AiAgent = typeof aiAgents.$inferSelect;
export type InsertAiAgent = typeof aiAgents.$inferInsert;



/**
 * User consents for LGPD compliance
 */
export const consents = mysqlTable("consents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  type: mysqlEnum("type", ["terms", "privacy", "marketing"]).notNull(),
  accepted: boolean("accepted").default(false).notNull(),
  acceptedAt: timestamp("acceptedAt"),
  revokedAt: timestamp("revokedAt"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  version: varchar("version", { length: 20 }).default("1.0"), // version of terms/privacy
});

export type Consent = typeof consents.$inferSelect;
export type InsertConsent = typeof consents.$inferInsert;

/**
 * Audit logs for security and LGPD compliance
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // "view", "create", "edit", "delete", "export", "login", "logout"
  resource: varchar("resource", { length: 100 }).notNull(), // "contact", "message", "pipeline", "user"
  resourceId: varchar("resourceId", { length: 64 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  details: text("details"), // JSON with additional info
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * LGPD data requests (deletion, portability, correction)
 */
export const lgpdRequests = mysqlTable("lgpd_requests", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  type: mysqlEnum("type", ["deletion", "portability", "correction"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "rejected"]).default("pending").notNull(),
  reason: text("reason"), // user's reason for request
  requestedAt: timestamp("requestedAt").defaultNow(),
  completedAt: timestamp("completedAt"),
  completedBy: varchar("completedBy", { length: 64 }), // admin user id
  notes: text("notes"), // admin notes
});

export type LgpdRequest = typeof lgpdRequests.$inferSelect;
export type InsertLgpdRequest = typeof lgpdRequests.$inferInsert;



/**
 * Organizations (Clientes/Empresas que compram o KanFlow)
 * Multi-tenant: cada organização é um cliente que paga pela plataforma
 */
export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly name
  ownerId: varchar("ownerId", { length: 64 }).notNull(), // usuário dono da org
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  cnpj: varchar("cnpj", { length: 18 }),
  address: text("address"),
  status: mysqlEnum("status", ["active", "suspended", "cancelled"]).default("active").notNull(),
  maxUsers: int("maxUsers").default(5).notNull(), // limite de usuários permitidos
  currentUsers: int("currentUsers").default(1).notNull(), // usuários ativos atualmente
  maxContacts: int("maxContacts").default(1000).notNull(), // limite de contatos
  maxWhatsappNumbers: int("maxWhatsappNumbers").default(1).notNull(), // limite de números WhatsApp
  trialEndsAt: timestamp("trialEndsAt"), // fim do período de teste
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Organization Members - relaciona usuários com organizações
 */
export const organizationMembers = mysqlTable("organization_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow(),
});

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = typeof organizationMembers.$inferInsert;

/**
 * Subscription Plans - Planos de assinatura disponíveis
 */
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Ex: "Starter", "Pro", "Enterprise"
  description: text("description"),
  price: int("price").notNull(), // preço em centavos (R$ 99,00 = 9900)
  billingCycle: mysqlEnum("billingCycle", ["monthly", "quarterly", "yearly"]).default("monthly").notNull(),
  maxUsers: int("maxUsers").notNull(),
  maxContacts: int("maxContacts").notNull(),
  maxWhatsappNumbers: int("maxWhatsappNumbers").notNull(),
  features: text("features"), // JSON array de features incluídas
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Subscriptions - Assinaturas ativas das organizações
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  planId: varchar("planId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "past_due", "cancelled", "expired"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Payments - Histórico de pagamentos
 */
export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  subscriptionId: varchar("subscriptionId", { length: 64 }).notNull(),
  amount: int("amount").notNull(), // em centavos
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }), // "credit_card", "pix", "boleto"
  transactionId: varchar("transactionId", { length: 255 }), // ID externo do gateway
  paidAt: timestamp("paidAt"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Usage Logs - Logs de uso para billing/analytics
 */
export const usageLogs = mysqlTable("usage_logs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  metric: varchar("metric", { length: 100 }).notNull(), // "users", "contacts", "messages", "whatsapp_numbers"
  value: int("value").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = typeof usageLogs.$inferInsert;

