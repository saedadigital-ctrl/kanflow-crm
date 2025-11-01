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

// Audit logs moved to line 446 (newer version with better schema)

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



/**
 * WhatsApp Accounts - Contas WhatsApp conectadas
 * Cada organização pode ter múltiplas contas WhatsApp
 */
export const whatsappAccounts = mysqlTable("whatsapp_accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull().unique(), // Ex: +5511999999999
  displayName: varchar("displayName", { length: 255 }), // Nome exibido nas conversas
  accessToken: text("accessToken"), // Token de acesso da Meta API
  businessAccountId: varchar("businessAccountId", { length: 255 }), // ID da conta de negócio
  phoneNumberId: varchar("phoneNumberId", { length: 255 }), // ID do número de telefone
  status: mysqlEnum("status", ["connected", "disconnected", "expired"]).default("disconnected").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(), // Número padrão para enviar mensagens
  lastSyncedAt: timestamp("lastSyncedAt"),
  expiresAt: timestamp("expiresAt"), // Data de expiração do token
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappAccount = typeof whatsappAccounts.$inferSelect;
export type InsertWhatsappAccount = typeof whatsappAccounts.$inferInsert;

/**
 * WhatsApp Conversations - Conversas com clientes
 * Rastreia todas as conversas por número WhatsApp
 */
export const whatsappConversations = mysqlTable("whatsapp_conversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  whatsappAccountId: varchar("whatsappAccountId", { length: 64 }).notNull(),
  contactId: varchar("contactId", { length: 64 }).notNull(), // Referência ao contato
  waContactId: varchar("waContactId", { length: 255 }), // ID do contato no WhatsApp
  status: mysqlEnum("status", ["active", "archived", "closed"]).default("active").notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  unreadCount: int("unreadCount").default(0).notNull(),
  assignedTo: varchar("assignedTo", { length: 64 }), // Usuário responsável
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappConversation = typeof whatsappConversations.$inferSelect;
export type InsertWhatsappConversation = typeof whatsappConversations.$inferInsert;

/**
 * WhatsApp Messages - Histórico de mensagens
 * Todas as mensagens enviadas e recebidas
 */
export const whatsappMessages = mysqlTable("whatsapp_messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  whatsappAccountId: varchar("whatsappAccountId", { length: 64 }).notNull(),
  waMessageId: varchar("waMessageId", { length: 255 }).unique(), // ID único do WhatsApp
  direction: mysqlEnum("direction", ["inbound", "outbound"]).notNull(), // Entrada ou saída
  messageType: mysqlEnum("messageType", ["text", "image", "document", "audio", "video", "template"]).default("text").notNull(),
  content: text("content"), // Conteúdo da mensagem
  mediaUrl: text("mediaUrl"), // URL da mídia se aplicável
  status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).default("sent").notNull(),
  senderPhone: varchar("senderPhone", { length: 20 }), // Número do remetente
  senderName: varchar("senderName", { length: 255 }), // Nome do remetente
  isFromBot: boolean("isFromBot").default(false).notNull(), // Se foi enviada por bot/automação
  automationId: varchar("automationId", { length: 64 }), // Referência à automação se aplicável
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
export type InsertWhatsappMessage = typeof whatsappMessages.$inferInsert;

/**
 * WhatsApp Templates - Templates de mensagens pré-aprovadas
 * Meta exige templates pré-aprovados para mensagens de negócio
 */
export const whatsappTemplates = mysqlTable("whatsapp_templates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  whatsappAccountId: varchar("whatsappAccountId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(), // Nome do template
  category: mysqlEnum("category", ["marketing", "authentication", "utility"]).default("utility").notNull(),
  language: varchar("language", { length: 10 }).default("pt_BR").notNull(),
  headerText: text("headerText"), // Cabeçalho do template
  bodyText: text("bodyText").notNull(), // Corpo da mensagem
  footerText: text("footerText"), // Rodapé
  buttons: text("buttons"), // JSON array de botões
  status: mysqlEnum("status", ["approved", "pending", "rejected"]).default("pending").notNull(),
  waTemplateId: varchar("waTemplateId", { length: 255 }), // ID do template no WhatsApp
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappTemplate = typeof whatsappTemplates.$inferSelect;
export type InsertWhatsappTemplate = typeof whatsappTemplates.$inferInsert;

/**
 * WhatsApp Webhooks - Configuração de webhooks da Meta
 * Para receber mensagens em tempo real
 */
export const whatsappWebhooks = mysqlTable("whatsapp_webhooks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  whatsappAccountId: varchar("whatsappAccountId", { length: 64 }).notNull(),
  webhookUrl: text("webhookUrl").notNull(), // URL para receber webhooks
  verifyToken: varchar("verifyToken", { length: 255 }).notNull(), // Token de verificação
  isActive: boolean("isActive").default(true).notNull(),
  lastReceivedAt: timestamp("lastReceivedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappWebhook = typeof whatsappWebhooks.$inferSelect;
export type InsertWhatsappWebhook = typeof whatsappWebhooks.$inferInsert;

/**
 * Licenses - Licenças ativas/suspensas/canceladas
 * Controla acesso dos clientes à plataforma
 */
export const licenses = mysqlTable("licenses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  licenseKey: varchar("licenseKey", { length: 255 }).notNull().unique(),
  status: mysqlEnum("status", ["active", "suspended", "expired", "cancelled"]).default("active").notNull(),
  startDate: timestamp("startDate").notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  renewalDate: timestamp("renewalDate"),
  lastAccessDate: timestamp("lastAccessDate"),
  accessCount: int("accessCount").default(0),
  reason: text("reason"), // Motivo da suspensão/cancelamento
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;



/**
 * Audit Logs - Logs de auditoria para compliance LGPD e segurança
 * Registra todas as ações importantes no sistema
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventType: varchar("eventType", { length: 100 }).notNull(), // Tipo de evento
  severity: mysqlEnum("severity", ["info", "warning", "error", "critical"]).notNull(),
  userId: varchar("userId", { length: 64 }), // Usuário que executou a ação
  organizationId: varchar("organizationId", { length: 64 }), // Organização relacionada
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 ou IPv6
  userAgent: text("userAgent"), // Browser/device info
  metadata: text("metadata"), // JSON com dados adicionais
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;




/**
 * Notifications - Histórico de notificações em tempo real
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(), // destinatário
  type: mysqlEnum("type", [
    "WHATSAPP_MESSAGE",
    "KANBAN_MOVE",
    "CONTACT_CREATED",
    "CONTACT_UPDATED",
    "DEAL_CREATED",
    "DEAL_UPDATED",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  entityType: varchar("entityType", { length: 50 }), // "message", "deal", "contact", "card"
  entityId: varchar("entityId", { length: 64 }), // ID do recurso relacionado
  channel: varchar("channel", { length: 50 }).default("websocket"), // "websocket", "email", "push"
  readAt: timestamp("readAt"), // null = não lido
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification Preferences - Preferências de notificação por usuário
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  userId: varchar("userId", { length: 64 }).primaryKey(),
  enableSound: boolean("enableSound").default(true).notNull(),
  muteFrom: varchar("muteFrom", { length: 5 }), // HH:mm (ex: "22:00")
  muteTo: varchar("muteTo", { length: 5 }), // HH:mm (ex: "08:00")
  whatsappMessage: boolean("whatsappMessage").default(true).notNull(),
  kanbanMove: boolean("kanbanMove").default(true).notNull(),
  contactUpdate: boolean("contactUpdate").default(false).notNull(),
  channels: text("channels"), // JSON array: ["websocket", "email", "push"]
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

