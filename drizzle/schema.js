import { mysqlEnum, mysqlTable, text, timestamp, varchar, int } from "drizzle-orm/mysql-core";
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
