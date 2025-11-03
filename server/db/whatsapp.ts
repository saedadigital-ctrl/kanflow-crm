import { eq, and } from "drizzle-orm";
import { whatsappConfigs, conversations } from "../../drizzle/schema";
import { getDb } from "../db";
import { randomUUID } from "crypto";

/**
 * Obter configuração WhatsApp da organização
 */
export async function getWhatsappConfig(organizationId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(whatsappConfigs)
    .where(eq(whatsappConfigs.organizationId, organizationId));

  return result.length > 0 ? result[0] : null;
}

/**
 * Criar ou atualizar configuração WhatsApp
 */
export async function saveWhatsappConfig(
  organizationId: string,
  data: {
    phoneNumber: string;
    displayName?: string;
    accessToken?: string;
    businessAccountId?: string;
    phoneNumberId?: string;
    connected?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getWhatsappConfig(organizationId);

  if (existing) {
    await db
      .update(whatsappConfigs)
      .set(data)
      .where(eq(whatsappConfigs.organizationId, organizationId));
    return existing;
  } else {
    const id = randomUUID();
    await db.insert(whatsappConfigs).values({
      id,
      organizationId,
      phoneNumber: data.phoneNumber,
      displayName: data.displayName,
      accessToken: data.accessToken,
      businessAccountId: data.businessAccountId,
      phoneNumberId: data.phoneNumberId,
      connected: data.connected || false,
    });
    return { id, organizationId, ...data };
  }
}

/**
 * Testar conexão WhatsApp
 */
export async function testWhatsappConnection(organizationId: string) {
  const config = await getWhatsappConfig(organizationId);
  if (!config || !config.accessToken) {
    return { success: false, message: "Configuração não encontrada" };
  }

  // Mock test - em produção, fazer chamada real à API WhatsApp
  return {
    success: true,
    message: "Conexão testada com sucesso",
    phoneNumber: config.phoneNumber,
  };
}

/**
 * Listar conversas da organização
 */
export async function getConversations(organizationId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.organizationId, organizationId));

  return result;
}

/**
 * Obter conversa por ID
 */
export async function getConversationById(
  id: string,
  organizationId: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, id),
        eq(conversations.organizationId, organizationId)
      )
    );

  return result.length > 0 ? result[0] : null;
}

/**
 * Criar conversa
 */
export async function createConversation(
  organizationId: string,
  contactId: string,
  lastSnippet?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = randomUUID();
  await db.insert(conversations).values({
    id,
    organizationId,
    contactId,
    lastSnippet,
    status: "active",
  });

  return { id, organizationId, contactId };
}

/**
 * Atualizar status da conversa
 */
export async function updateConversationStatus(
  id: string,
  organizationId: string,
  status: "active" | "waiting" | "resolved" | "archived"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(conversations)
    .set({ status })
    .where(
      and(
        eq(conversations.id, id),
        eq(conversations.organizationId, organizationId)
      )
    );

  return { id, status };
}

/**
 * Marcar conversa como lida
 */
export async function markConversationAsRead(
  id: string,
  organizationId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(conversations)
    .set({ unreadCount: 0 })
    .where(
      and(
        eq(conversations.id, id),
        eq(conversations.organizationId, organizationId)
      )
    );

  return { id, unreadCount: 0 };
}

/**
 * Incrementar contador de mensagens não lidas
 */
export async function incrementUnreadCount(
  id: string,
  organizationId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conv = await getConversationById(id, organizationId);
  if (!conv) return null;

  const newCount = (conv.unreadCount || 0) + 1;
  await db
    .update(conversations)
    .set({ unreadCount: newCount })
    .where(
      and(
        eq(conversations.id, id),
        eq(conversations.organizationId, organizationId)
      )
    );

  return { id, unreadCount: newCount };
}

