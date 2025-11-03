import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Users table - backing auth flow
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
 * Pipeline stages for Kanban board
 */
export const pipelineStages = mysqlTable("pipeline_stages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").notNull(),
  color: varchar("color", { length: 7 }).default("#3b82f6"),
  userId: varchar("userId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type PipelineStage = typeof pipelineStages.$inferSelect;
export type InsertPipelineStage = typeof pipelineStages.$inferInsert;

/**
 * Contacts
 */
export const contacts = mysqlTable("contacts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  avatarUrl: text("avatarUrl"),
  notes: text("notes"),
  stageId: varchar("stageId", { length: 64 }),
  userId: varchar("userId", { length: 64 }).notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Messages
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  contactId: varchar("contactId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  direction: mysqlEnum("direction", ["inbound", "outbound"]).notNull(),
  status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).default("sent"),
  mediaUrl: text("mediaUrl"),
  mediaType: varchar("mediaType", { length: 50 }),
  sentBy: varchar("sentBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================
// MULTI-TENANT TABLES
// ============================================

/**
 * Organizations - Multi-tenant support
 */
export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logoUrl"),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  
  // Metadata
  plan: varchar("plan", { length: 50 }).default("starter"), // starter, professional, enterprise
  status: varchar("status", { length: 50 }).default("active"), // active, trialing, suspended, canceled
  maxUsers: int("maxUsers").default(5),
  maxContacts: int("maxContacts").default(1000),
  maxConversations: int("maxConversations").default(10000),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Organization Members - User roles per organization
 */
export const organizationMembers = mysqlTable("organization_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(), // owner, admin, member, viewer
  status: varchar("status", { length: 50 }).default("active"), // active, invited, suspended
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = typeof organizationMembers.$inferInsert;

/**
 * Organization Invites - Pending invitations
 */
export const organizationInvites = mysqlTable("organization_invites", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
});

export type OrganizationInvite = typeof organizationInvites.$inferSelect;
export type InsertOrganizationInvite = typeof organizationInvites.$inferInsert;


// ============================================
// WHATSAPP TABLES
// ============================================

/**
 * WhatsApp Configurations
 */
export const whatsappConfigs = mysqlTable("whatsapp_configs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  displayName: varchar("displayName", { length: 255 }),
  accessToken: text("accessToken"),
  businessAccountId: varchar("businessAccountId", { length: 255 }),
  phoneNumberId: varchar("phoneNumberId", { length: 255 }),
  connected: boolean("connected").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type WhatsappConfig = typeof whatsappConfigs.$inferSelect;
export type InsertWhatsappConfig = typeof whatsappConfigs.$inferInsert;

/**
 * Conversations - Chat history
 */
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  contactId: varchar("contactId", { length: 64 }).notNull(),
  lastSnippet: text("lastSnippet"),
  unreadCount: int("unreadCount").default(0),
  status: varchar("status", { length: 50 }).default("active"),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

