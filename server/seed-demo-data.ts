import { getDb } from "./db";
import { users, contacts, organizations } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Script para popular banco de dados com dados de demo
 * Uso: DATABASE_URL="..." npx tsx server/seed-demo-data.ts
 */

const demoUsers = [
  {
    id: "demo-user-1",
    name: "João Silva",
    email: "joao@example.com",
    loginMethod: "demo",
    role: "admin" as const,
    createdAt: new Date(),
    lastSignedIn: new Date(),
  },
  {
    id: "demo-user-2",
    name: "Maria Santos",
    email: "maria@example.com",
    loginMethod: "demo",
    role: "user" as const,
    createdAt: new Date(),
    lastSignedIn: new Date(),
  },
  {
    id: "demo-user-3",
    name: "Pedro Oliveira",
    email: "pedro@example.com",
    loginMethod: "demo",
    role: "user" as const,
    createdAt: new Date(),
    lastSignedIn: new Date(),
  },
];

const demoContacts = [
  {
    id: "contact-1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+5511987654321",
    company: "Acme Corp",
    status: "novo_lead",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "contact-2",
    name: "Tech Solutions Ltd",
    email: "info@techsolutions.com",
    phone: "+5511987654322",
    company: "Tech Solutions",
    status: "contato_inicial",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "contact-3",
    name: "Global Industries",
    email: "sales@globalind.com",
    phone: "+5511987654323",
    company: "Global Industries",
    status: "negociacao",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "contact-4",
    name: "Innovation Labs",
    email: "contact@innovationlabs.com",
    phone: "+5511987654324",
    company: "Innovation Labs",
    status: "proposta",
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: "contact-5",
    name: "Future Ventures",
    email: "hello@futureventures.com",
    phone: "+5511987654325",
    company: "Future Ventures",
    status: "fechado_ganho",
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 345600000),
  },
  {
    id: "contact-6",
    name: "Startup XYZ",
    email: "contact@startupxyz.com",
    phone: "+5511987654326",
    company: "Startup XYZ",
    status: "fechado_perdido",
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
  },
  {
    id: "contact-7",
    name: "Digital Transformation Inc",
    email: "info@digitaltransform.com",
    phone: "+5511987654327",
    company: "Digital Transformation",
    status: "novo_lead",
    createdAt: new Date(Date.now() - 518400000),
    updatedAt: new Date(Date.now() - 518400000),
  },
  {
    id: "contact-8",
    name: "Cloud Computing Services",
    email: "sales@cloudservices.com",
    phone: "+5511987654328",
    company: "Cloud Services",
    status: "contato_inicial",
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(Date.now() - 604800000),
  },
];

async function seedDemoData() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("Banco de dados não disponível");
      process.exit(1);
    }

    console.log("🌱 Iniciando seed de dados de demo...");

    // Limpar dados existentes (opcional)
    // await db.delete(contacts);
    // await db.delete(users);

    // Inserir usuários
    console.log("👥 Inserindo usuários de demo...");
    for (const user of demoUsers) {
      await db
        .insert(users)
        .values(user)
        .onDuplicateKeyUpdate({
          set: {
            name: user.name,
            email: user.email,
            lastSignedIn: new Date(),
          },
        });
    }
    console.log(`✅ ${demoUsers.length} usuários inseridos`);

    // Inserir contatos
    console.log("📋 Inserindo contatos de demo...");
    for (const contact of demoContacts) {
      await db
        .insert(contacts)
        .values(contact)
        .onDuplicateKeyUpdate({
          set: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ ${demoContacts.length} contatos inseridos`);

    console.log("\n✨ Seed de dados concluído com sucesso!");
    console.log("\n📊 Dados de Demo Inseridos:");
    console.log(`- Usuários: ${demoUsers.length}`);
    console.log(`- Contatos: ${demoContacts.length}`);
    console.log("\n🔑 Credenciais de Demo:");
    console.log("Email: joao@example.com");
    console.log("Senha: (use Manus Auth)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedDemoData();

