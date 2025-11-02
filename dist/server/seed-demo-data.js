import { users, contacts, pipelineStages, messages } from "../drizzle/schema.js";
import { getDb } from "./db.js";
const demoUsers = [
    {
        id: "demo-user-1",
        name: "João Silva",
        email: "joao@example.com",
        loginMethod: "demo",
        role: "admin",
    },
    {
        id: "demo-user-2",
        name: "Maria Santos",
        email: "maria@example.com",
        loginMethod: "demo",
        role: "user",
    },
];
const demoStages = [
    { id: "stage-1", name: "Leads", order: 0, color: "#ef4444", userId: "demo-user-1" },
    { id: "stage-2", name: "Contacting", order: 1, color: "#f97316", userId: "demo-user-1" },
    { id: "stage-3", name: "Negotiating", order: 2, color: "#eab308", userId: "demo-user-1" },
    { id: "stage-4", name: "Closed", order: 3, color: "#22c55e", userId: "demo-user-1" },
];
const demoContacts = [
    {
        id: "contact-1",
        name: "Leslie Alexander",
        phoneNumber: "+1203505097",
        email: "leslie@example.com",
        stageId: "stage-1",
        userId: "demo-user-1",
    },
    {
        id: "contact-2",
        name: "Wade Warren",
        phoneNumber: "+16035550192",
        email: "wade@example.com",
        stageId: "stage-2",
        userId: "demo-user-1",
    },
    {
        id: "contact-3",
        name: "Robert Fox",
        phoneNumber: "+12175550199",
        email: "robert@example.com",
        stageId: "stage-3",
        userId: "demo-user-1",
    },
];
const demoMessages = [
    {
        id: "msg-1",
        contactId: "contact-1",
        content: "Could you provide more info?",
        direction: "inbound",
        sentBy: "contact-1",
    },
    {
        id: "msg-2",
        contactId: "contact-2",
        content: "I'd like to learn more about your services.",
        direction: "inbound",
        sentBy: "contact-2",
    },
    {
        id: "msg-3",
        contactId: "contact-3",
        content: "I'll have to discuss this with my team.",
        direction: "inbound",
        sentBy: "contact-3",
    },
];
export async function seedDemoData() {
    const db = await getDb();
    if (!db) {
        console.log("Database not available");
        return;
    }
    try {
        console.log("🌱 Iniciando seed de dados de demo...");
        // Insert users
        console.log("👥 Inserindo usuários de demo...");
        for (const user of demoUsers) {
            await db.insert(users).values(user).onDuplicateKeyUpdate({ set: user });
        }
        // Insert pipeline stages
        console.log("📊 Inserindo estágios do pipeline...");
        for (const stage of demoStages) {
            await db.insert(pipelineStages).values(stage).onDuplicateKeyUpdate({ set: stage });
        }
        // Insert contacts
        console.log("👤 Inserindo contatos...");
        for (const contact of demoContacts) {
            await db.insert(contacts).values(contact).onDuplicateKeyUpdate({ set: contact });
        }
        // Insert messages
        console.log("💬 Inserindo mensagens...");
        for (const message of demoMessages) {
            await db.insert(messages).values(message).onDuplicateKeyUpdate({ set: message });
        }
        console.log("✅ Seed de dados concluído!");
        console.log("🔑 Credenciais de Demo:");
        console.log("Email: joao@example.com");
        console.log("Senha: (use Manus Auth)");
    }
    catch (error) {
        console.error("❌ Erro ao fazer seed:", error);
    }
}
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDemoData().then(() => process.exit(0));
}
