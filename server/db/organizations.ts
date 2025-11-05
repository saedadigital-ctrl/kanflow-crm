import { eq, and } from "drizzle-orm";
import { organizations, organizationMembers, organizationInvites } from "../../drizzle/schema";
import { getDb } from "../db";
import { randomUUID } from "crypto";

const uuidv4 = randomUUID;

/**
 * Criar nova organização
 */
export async function createOrganization(
  data: {
    name: string;
    slug: string;
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
  },
  userId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = uuidv4();
  
  // Criar organização
  await db.insert(organizations).values({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    website: data.website,
    phone: data.phone,
    email: data.email,
    plan: "starter",
    status: "active",
  });

  // Adicionar usuário como owner
  await db.insert(organizationMembers).values({
    id: uuidv4(),
    organizationId: id,
    userId,
    role: "owner",
    status: "active",
  });

  return { id, name: data.name, slug: data.slug };
}

/**
 * Obter organizações do usuário
 */
export async function getOrganizations(userId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      description: organizations.description,
      logoUrl: organizations.logoUrl,
      plan: organizations.plan,
      status: organizations.status,
      createdAt: organizations.createdAt,
    })
    .from(organizations)
    .innerJoin(
      organizationMembers,
      eq(organizations.id, organizationMembers.organizationId)
    )
    .where(eq(organizationMembers.userId, userId));

  return result;
}

/**
 * Obter organização por ID
 */
export async function getOrganizationById(id: string, userId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(organizations)
    .innerJoin(
      organizationMembers,
      and(
        eq(organizations.id, organizationMembers.organizationId),
        eq(organizationMembers.userId, userId)
      )
    )
    .where(eq(organizations.id, id));

  return result.length > 0 ? result[0].organizations : null;
}

/**
 * Atualizar organização
 */
export async function updateOrganization(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    website: string;
    phone: string;
    email: string;
    plan: string;
    status: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(organizations).set(data).where(eq(organizations.id, id));

  return { id, ...data };
}

/**
 * Deletar organização
 */
export async function deleteOrganization(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(organizations).where(eq(organizations.id, id));
}

/**
 * Adicionar membro à organização
 */
export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: string = "member",
  requesterId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = uuidv4();
  
  await db.insert(organizationMembers).values({
    id,
    organizationId,
    userId,
    role,
    status: "active",
  });

  return { id, organizationId, userId, role };
}

/**
 * Remover membro da organização
 */
export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
  requesterId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      )
    );
}

/**
 * Listar membros da organização
 */
export async function listOrganizationMembers(
  organizationId: string,
  requesterId: string
) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: organizationMembers.id,
      userId: organizationMembers.userId,
      role: organizationMembers.role,
      status: organizationMembers.status,
      createdAt: organizationMembers.createdAt,
    })
    .from(organizationMembers)
    .where(eq(organizationMembers.organizationId, organizationId));

  return result;
}

/**
 * Convidar membro por email
 */
export async function inviteMember(
  organizationId: string,
  email: string,
  role: string = "member",
  requesterId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = uuidv4();
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(organizationInvites).values({
    id,
    organizationId,
    email,
    role,
    token,
    expiresAt,
  });

  return { id, email, role, token };
}

/**
 * Aceitar convite
 */
export async function acceptInvite(token: string, userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar convite
  const invites = await db
    .select()
    .from(organizationInvites)
    .where(eq(organizationInvites.token, token));

  if (invites.length === 0) {
    throw new Error("Convite não encontrado");
  }

  const invite = invites[0];

  // Verificar se expirou
  if (new Date() > invite.expiresAt) {
    throw new Error("Convite expirado");
  }

  // Adicionar membro
  const memberId = uuidv4();
  await db.insert(organizationMembers).values({
    id: memberId,
    organizationId: invite.organizationId,
    userId,
    role: invite.role,
    status: "active",
  });

  // Deletar convite
  await db
    .delete(organizationInvites)
    .where(eq(organizationInvites.id, invite.id));

  return { organizationId: invite.organizationId, role: invite.role };
}

