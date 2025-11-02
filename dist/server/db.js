import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, contacts, pipelineStages, messages, } from "../drizzle/schema.js";
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
// Users
export async function upsertUser(user) {
    if (!user.id) {
        throw new Error("User ID is required");
    }
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot upsert user: database not available");
        return;
    }
    try {
        const values = { id: user.id };
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
        if (user.role === undefined && user.id === ENV.ownerId) {
            values.role = "admin";
            updateSet.role = "admin";
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
// Pipeline Stages
export async function getPipelineStages(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return db
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
    return stage;
}
// Contacts
export async function getContacts(userId) {
    const db = await getDb();
    if (!db)
        return [];
    return db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .orderBy(desc(contacts.createdAt));
}
export async function createContact(contact) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(contacts).values(contact);
    return contact;
}
export async function updateContact(id, updates) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.update(contacts).set(updates).where(eq(contacts.id, id));
    return db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
}
// Messages
export async function getMessages(contactId) {
    const db = await getDb();
    if (!db)
        return [];
    return db
        .select()
        .from(messages)
        .where(eq(messages.contactId, contactId))
        .orderBy(desc(messages.createdAt));
}
export async function createMessage(message) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    await db.insert(messages).values(message);
    return message;
}
