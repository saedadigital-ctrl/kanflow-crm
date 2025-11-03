# 📚 Manual Técnico - KanFlow CRM

**Versão:** 1.0.0  
**Data:** Novembro de 2024  
**Autor:** Manus AI / Studio AEDA Digital  
**Licença:** MIT

---

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Banco de Dados](#banco-de-dados)
6. [APIs tRPC](#apis-trpc)
7. [Autenticação e Segurança](#autenticação-e-segurança)
8. [Frontend - Componentes e Páginas](#frontend---componentes-e-páginas)
9. [Backend - Servidores e Routers](#backend---servidores-e-routers)
10. [Funcionalidades Principais](#funcionalidades-principais)
11. [Fluxos de Dados](#fluxos-de-dados)
12. [Deployment e DevOps](#deployment-e-devops)
13. [Variáveis de Ambiente](#variáveis-de-ambiente)
14. [Scripts e Comandos](#scripts-e-comandos)
15. [Troubleshooting](#troubleshooting)
16. [Roadmap Técnico](#roadmap-técnico)

---

## Visão Geral

O **KanFlow CRM** é um sistema de gerenciamento de relacionamento com clientes (CRM) moderno e profissional, desenvolvido especificamente para gestão de contatos e conversas do WhatsApp em formato Kanban. A plataforma oferece uma interface intuitiva e poderosa para equipes de vendas e atendimento, com suporte completo a autenticação, conformidade LGPD, painel administrativo multi-tenant e integração com inteligência artificial.

### Objetivos Principais

O KanFlow foi desenvolvido com os seguintes objetivos:

- **Gestão Visual de Pipeline:** Implementar um Kanban board interativo para visualizar e gerenciar leads em diferentes etapas do funil de vendas
- **Centralização de Contatos:** Manter um banco de dados centralizado de contatos com histórico completo de interações
- **Automação Inteligente:** Integrar IA para análise de mensagens e sugestão de respostas automáticas
- **Conformidade Legal:** Garantir conformidade total com a Lei Geral de Proteção de Dados (LGPD)
- **Escalabilidade:** Suportar múltiplas organizações e usuários através de arquitetura multi-tenant
- **Segurança:** Implementar autenticação robusta, criptografia e auditoria de todas as ações

---

## Arquitetura do Sistema

O KanFlow utiliza uma arquitetura moderna de três camadas (3-tier) com separação clara entre frontend, backend e banco de dados.

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React 19 + TypeScript + Vite + TailwindCSS 4         │  │
│  │ - SPA (Single Page Application)                      │  │
│  │ - Componentes shadcn/ui                             │  │
│  │ - Roteamento com Wouter                             │  │
│  │ - Cliente tRPC type-safe                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APLICAÇÃO                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Node.js + Express 4 + tRPC 11                        │  │
│  │ - Servidor HTTP com middleware                       │  │
│  │ - Routers tRPC type-safe                            │  │
│  │ - Autenticação JWT                                  │  │
│  │ - WebSocket para notificações em tempo real         │  │
│  │ - Integração OAuth (Manus)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MySQL + Drizzle ORM                                 │  │
│  │ - Schema type-safe com TypeScript                   │  │
│  │ - Migrations automáticas                            │  │
│  │ - Query builders type-safe                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Requisição

Quando um usuário interage com a aplicação, o fluxo de uma requisição segue este padrão:

1. **Cliente (Frontend):** O usuário interage com a interface React
2. **tRPC Client:** A aplicação frontend chama um procedimento tRPC type-safe
3. **HTTP Request:** O cliente envia uma requisição HTTP para `/api/trpc/*`
4. **Express Middleware:** O servidor Express processa a requisição através de middlewares
5. **Autenticação:** O contexto tRPC extrai o usuário da sessão JWT
6. **Router tRPC:** O router apropriado processa a lógica de negócio
7. **Database Query:** O Drizzle ORM executa a query SQL no MySQL
8. **Response:** O resultado é retornado ao cliente em JSON com tipos TypeScript garantidos

---

## Stack Tecnológico

### Frontend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 19.1.1 | Biblioteca UI para interfaces reativas |
| **TypeScript** | 5.9.3 | Tipagem estática e segurança de tipos |
| **Vite** | 7.1.7 | Build tool rápido e moderno |
| **TailwindCSS** | 4.1.14 | Utilitários CSS para estilização |
| **Shadcn/ui** | Latest | Componentes UI acessíveis e customizáveis |
| **tRPC** | 11.6.0 | Cliente RPC type-safe |
| **React Query** | 5.90.2 | Gerenciamento de estado assíncrono |
| **Wouter** | 3.3.5 | Roteador leve para SPA |
| **Recharts** | 2.15.2 | Gráficos interativos |
| **Lucide React** | 0.453.0 | Ícones SVG |
| **Framer Motion** | 12.23.22 | Animações suaves |
| **React Hook Form** | 7.64.0 | Gerenciamento de formulários |
| **Zod** | 4.1.12 | Validação de schemas |

### Backend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Node.js** | 22.x | Runtime JavaScript |
| **Express** | 4.21.2 | Framework web minimalista |
| **tRPC** | 11.6.0 | RPC type-safe |
| **Drizzle ORM** | 0.44.5 | ORM type-safe para SQL |
| **MySQL2** | 3.15.0 | Driver MySQL |
| **JWT (jose)** | 6.1.0 | Autenticação baseada em tokens |
| **Socket.io** | 4.8.1 | WebSocket para notificações em tempo real |
| **Helmet** | 8.1.0 | Headers de segurança HTTP |
| **CORS** | 2.8.5 | Controle de requisições cross-origin |
| **Express Rate Limit** | 8.1.0 | Limitação de requisições |
| **Nanoid** | 5.1.5 | Gerador de IDs únicos |

### DevOps e Deployment

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Vercel** | - | Hosting e deployment serverless |
| **GitHub** | - | Controle de versão e CI/CD |
| **pnpm** | 10.15.1 | Gerenciador de pacotes |
| **Docker** | - | Containerização (opcional) |

---

## Estrutura do Projeto

A estrutura de diretórios do KanFlow segue as melhores práticas de organização para projetos full-stack:

```
kanflow-crm/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas da aplicação
│   │   │   ├── Dashboard.tsx       # Dashboard com métricas
│   │   │   ├── Pipeline.tsx        # Kanban board
│   │   │   ├── Contacts.tsx        # Gestão de contatos
│   │   │   ├── Chats.tsx           # Mensagens
│   │   │   ├── Settings.tsx        # Configurações
│   │   │   ├── Login.tsx           # Página de login com abas
│   │   │   ├── AdminPanel.tsx      # Painel administrativo
│   │   │   ├── AIAgents.tsx        # Agentes de IA
│   │   │   ├── Automations.tsx     # Automações
│   │   │   └── ...
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── ui/                # Componentes shadcn/ui
│   │   │   ├── DashboardLayout.tsx # Layout com sidebar
│   │   │   ├── ErrorBoundary.tsx   # Tratamento de erros
│   │   │   └── ...
│   │   ├── contexts/               # React Contexts
│   │   │   └── ThemeContext.tsx    # Contexto de tema
│   │   ├── hooks/                  # Custom hooks
│   │   │   └── useAuth.ts          # Hook de autenticação
│   │   ├── lib/                    # Bibliotecas e utilitários
│   │   │   ├── trpc.ts            # Cliente tRPC
│   │   │   └── utils.ts           # Funções utilitárias
│   │   ├── _core/                  # Core da aplicação
│   │   │   ├── hooks/             # Hooks do core
│   │   │   └── ...
│   │   ├── App.tsx                # Componente raiz
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Estilos globais
│   ├── public/                     # Assets estáticos
│   │   ├── kanflow-logo.png       # Logo da aplicação
│   │   └── ...
│   └── index.html                 # Template HTML
│
├── server/                         # Backend Node.js
│   ├── routers.ts                 # Routers tRPC principais
│   ├── db.ts                      # Funções de banco de dados
│   ├── seed-demo-data.ts          # Seed de dados de demo
│   └── _core/                     # Core do servidor
│       ├── index.ts               # Entry point do servidor
│       ├── context.ts             # Contexto tRPC
│       ├── trpc.ts                # Configuração tRPC
│       ├── oauth.ts               # Integração OAuth
│       ├── cookies.ts             # Gerenciamento de cookies
│       ├── sdk.ts                 # SDK de autenticação
│       ├── env.ts                 # Variáveis de ambiente
│       ├── vite.ts                # Configuração Vite
│       ├── systemRouter.ts        # Router de sistema
│       └── ...
│
├── drizzle/                       # Schema e migrations
│   ├── schema.ts                  # Definição de tabelas
│   └── migrations/                # Arquivos de migração
│
├── shared/                        # Código compartilhado
│   ├── const.ts                   # Constantes
│   └── types.ts                   # Tipos compartilhados
│
├── storage/                       # Utilitários de storage S3
│   └── index.ts                   # Funções de upload/download
│
├── vite.config.ts                # Configuração Vite
├── tsconfig.json                 # Configuração TypeScript
├── tsconfig.server.json          # Configuração TypeScript para servidor
├── package.json                  # Dependências e scripts
├── pnpm-lock.yaml               # Lock file do pnpm
├── vercel.json                  # Configuração Vercel
├── .env.example                 # Exemplo de variáveis de ambiente
├── README.md                    # Documentação geral
└── MANUAL_TECNICO.md           # Este arquivo
```

### Convenções de Nomenclatura

O projeto segue as seguintes convenções:

- **Arquivos TypeScript:** camelCase (ex: `useAuth.ts`, `createContext.ts`)
- **Componentes React:** PascalCase (ex: `Dashboard.tsx`, `DashboardLayout.tsx`)
- **Variáveis de banco:** camelCase (ex: `userId`, `createdAt`)
- **Constantes:** UPPER_SNAKE_CASE (ex: `COOKIE_NAME`, `ONE_YEAR_MS`)
- **Routers tRPC:** camelCase (ex: `pipelineRouter`, `contactsRouter`)

---

## Banco de Dados

### Schema e Tabelas

O KanFlow utiliza o Drizzle ORM para definir o schema do banco de dados de forma type-safe. O arquivo principal é `drizzle/schema.ts`.

#### Tabela: users

Armazena informações dos usuários do sistema.

```typescript
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(64) | Identificador único do usuário (chave primária) |
| `name` | TEXT | Nome completo do usuário |
| `email` | VARCHAR(320) | Email do usuário |
| `loginMethod` | VARCHAR(64) | Método de login utilizado (oauth, email, etc) |
| `role` | ENUM | Papel do usuário: "user" ou "admin" |
| `createdAt` | TIMESTAMP | Data de criação da conta |
| `lastSignedIn` | TIMESTAMP | Último acesso ao sistema |

#### Tabela: pipeline_stages

Define as etapas do funil de vendas (Kanban board).

```typescript
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
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(64) | Identificador único da etapa |
| `name` | VARCHAR(255) | Nome da etapa (ex: "Prospectando", "Negociando") |
| `description` | TEXT | Descrição detalhada da etapa |
| `order` | INT | Ordem de exibição no Kanban |
| `color` | VARCHAR(7) | Cor hexadecimal para visualização |
| `userId` | VARCHAR(64) | ID do usuário proprietário |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |

#### Tabela: contacts

Armazena informações dos contatos (leads/clientes).

```typescript
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
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(64) | Identificador único do contato |
| `name` | VARCHAR(255) | Nome do contato |
| `phoneNumber` | VARCHAR(20) | Número de telefone (WhatsApp) |
| `email` | VARCHAR(320) | Email do contato |
| `avatarUrl` | TEXT | URL da foto de perfil |
| `notes` | TEXT | Notas internas sobre o contato |
| `stageId` | VARCHAR(64) | ID da etapa atual no pipeline |
| `userId` | VARCHAR(64) | ID do usuário proprietário |
| `lastMessageAt` | TIMESTAMP | Última mensagem recebida/enviada |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |

#### Tabela: messages

Armazena histórico de mensagens entre usuários e contatos.

```typescript
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
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(64) | Identificador único da mensagem |
| `contactId` | VARCHAR(64) | ID do contato relacionado |
| `content` | TEXT | Conteúdo da mensagem |
| `direction` | ENUM | "inbound" (recebida) ou "outbound" (enviada) |
| `status` | ENUM | Status: "sent", "delivered", "read", "failed" |
| `mediaUrl` | TEXT | URL de mídia anexada (imagem, vídeo, etc) |
| `mediaType` | VARCHAR(50) | Tipo de mídia (image/jpeg, video/mp4, etc) |
| `sentBy` | VARCHAR(64) | ID do usuário que enviou |
| `createdAt` | TIMESTAMP | Data de envio/recebimento |

### Relacionamentos

Os relacionamentos entre tabelas são implementados através de foreign keys:

- **users ← pipeline_stages:** Um usuário pode ter múltiplas etapas de pipeline
- **users ← contacts:** Um usuário pode ter múltiplos contatos
- **contacts ← messages:** Um contato pode ter múltiplas mensagens
- **pipeline_stages ← contacts:** Uma etapa pode conter múltiplos contatos

### Migrations

As migrations são gerenciadas pelo Drizzle Kit. Para executar as migrations:

```bash
pnpm db:push
```

Este comando:
1. Gera os arquivos de migração baseado no schema
2. Executa as migrations no banco de dados
3. Atualiza o arquivo de lock

---

## APIs tRPC

O KanFlow utiliza tRPC para criar APIs type-safe, onde o cliente e servidor compartilham os mesmos tipos TypeScript.

### Estrutura de Routers

Os routers tRPC são definidos em `server/routers.ts` e organizados por domínio:

```typescript
export const appRouter = router({
  system: systemRouter,      // Sistema e notificações
  auth: router({...}),       // Autenticação
  pipeline: pipelineRouter,  // Gestão de pipeline
  contacts: contactsRouter,  // Gestão de contatos
  messages: messagesRouter,  // Mensagens
  dashboard: dashboardRouter,// Dashboard
  ai: aiRouter,              // IA e análise
});
```

### Tipos de Procedimentos

#### publicProcedure

Procedimentos públicos que não requerem autenticação:

```typescript
me: publicProcedure.query(opts => opts.ctx.user ?? null)
```

#### protectedProcedure

Procedimentos protegidos que requerem autenticação:

```typescript
list: protectedProcedure.query(async ({ ctx }) => {
  return db.getPipelineStages(ctx.user.id);
})
```

### Endpoints Principais

#### Authentication

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `auth.me` | Query | Pública | Retorna dados do usuário atual ou null |
| `auth.logout` | Mutation | Pública | Faz logout do usuário |
| `auth.demoLogin` | Mutation | Pública | Login de demo para testes |

**Exemplo de uso:**

```typescript
// Frontend
const { data: user } = trpc.auth.me.useQuery();
const logoutMutation = trpc.auth.logout.useMutation();

logoutMutation.mutate();
```

#### Pipeline

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `pipeline.list` | Query | Protegida | Lista todas as etapas do pipeline |
| `pipeline.create` | Mutation | Protegida | Cria nova etapa de pipeline |

**Input para pipeline.create:**

```typescript
{
  name: string;           // Nome da etapa
  color?: string;         // Cor hexadecimal (padrão: #3b82f6)
}
```

**Exemplo de uso:**

```typescript
const pipelineQuery = trpc.pipeline.list.useQuery();
const createStageMutation = trpc.pipeline.create.useMutation({
  onSuccess: () => {
    // Invalidar cache
    trpc.useUtils().pipeline.list.invalidate();
  }
});

createStageMutation.mutate({
  name: "Prospectando",
  color: "#06B6D4"
});
```

#### Contacts

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `contacts.list` | Query | Protegida | Lista todos os contatos |
| `contacts.create` | Mutation | Protegida | Cria novo contato |
| `contacts.update` | Mutation | Protegida | Atualiza contato existente |

**Input para contacts.create:**

```typescript
{
  name: string;           // Nome do contato
  phoneNumber: string;    // Número de telefone
  email?: string;         // Email (opcional)
  stageId?: string;       // ID da etapa (opcional)
}
```

**Input para contacts.update:**

```typescript
{
  id: string;             // ID do contato
  stageId?: string;       // Nova etapa (opcional)
  name?: string;          // Novo nome (opcional)
}
```

**Exemplo de uso:**

```typescript
const contactsQuery = trpc.contacts.list.useQuery();
const createContactMutation = trpc.contacts.create.useMutation();

createContactMutation.mutate({
  name: "João Silva",
  phoneNumber: "+5511999999999",
  email: "joao@example.com"
});
```

#### Messages

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `messages.list` | Query | Protegida | Lista mensagens de um contato |
| `messages.create` | Mutation | Protegida | Cria nova mensagem |

**Input para messages.list:**

```typescript
{
  contactId: string;      // ID do contato
}
```

**Input para messages.create:**

```typescript
{
  contactId: string;      // ID do contato
  content: string;        // Conteúdo da mensagem
  direction: "inbound" | "outbound"; // Direção
}
```

#### Dashboard

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `dashboard.stats` | Query | Protegida | Retorna estatísticas do dashboard |

**Response:**

```typescript
{
  totalContacts: number;
  totalStages: number;
  contactsByStage: Array<{
    stageName: string;
    count: number;
  }>;
}
```

#### AI

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `ai.analyzeMessage` | Mutation | Protegida | Analisa sentimento e categoria |
| `ai.suggestResponse` | Mutation | Protegida | Sugere resposta automática |

**Input para ai.analyzeMessage:**

```typescript
{
  content: string;        // Conteúdo a analisar
}
```

**Response:**

```typescript
{
  sentiment: "positive" | "negative" | "neutral";
  category: string;
  priority: "low" | "normal" | "high";
}
```

**Input para ai.suggestResponse:**

```typescript
{
  messageContent: string; // Mensagem do contato
  contactName: string;    // Nome do contato
}
```

**Response:**

```typescript
{
  suggestedResponse: string;
  confidence: number;     // 0-1
}
```

### Tratamento de Erros

O tRPC fornece tratamento de erros automático:

```typescript
const mutation = trpc.contacts.create.useMutation({
  onError: (error) => {
    console.error("Erro:", error.message);
    // error.data.code contém o código de erro tRPC
  }
});
```

Códigos de erro tRPC:

- `PARSE_ERROR` - Erro ao fazer parse da requisição
- `BAD_REQUEST` - Validação falhou (Zod)
- `UNAUTHORIZED` - Autenticação necessária
- `FORBIDDEN` - Permissão insuficiente
- `NOT_FOUND` - Recurso não encontrado
- `INTERNAL_SERVER_ERROR` - Erro no servidor

---

## Autenticação e Segurança

### Fluxo de Autenticação

O KanFlow implementa um sistema robusto de autenticação baseado em JWT (JSON Web Tokens) com integração OAuth.

#### 1. Login OAuth (Manus)

O fluxo de login OAuth com Manus segue este padrão:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Login com Manus Auth"                  │
│    - Frontend redireciona para getLoginUrl()               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Servidor Manus autentica o usuário                       │
│    - Usuário faz login com credenciais                      │
│    - Manus gera authorization code                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Callback para /api/oauth/callback                        │
│    - Frontend recebe authorization code                     │
│    - Redireciona para /api/oauth/callback?code=xxx         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend processa o callback                              │
│    - Valida authorization code                              │
│    - Troca code por access token                            │
│    - Busca/cria usuário no banco de dados                   │
│    - Cria session token JWT                                 │
│    - Define cookie de sessão                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Redireciona para /dashboard                              │
│    - Cookie de sessão está definido                         │
│    - Usuário autenticado                                    │
└─────────────────────────────────────────────────────────────┘
```

#### 2. JWT e Cookies

Após o login bem-sucedido, o servidor cria um JWT e o armazena em um cookie seguro:

```typescript
// server/_core/sdk.ts
const sessionToken = await sdk.createSessionToken(user.id, {
  name: user.name || ""
});

// server/_core/cookies.ts
ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
```

As opções do cookie incluem:

- `httpOnly: true` - Inacessível via JavaScript (proteção contra XSS)
- `secure: true` - Apenas enviado via HTTPS
- `sameSite: "lax"` - Proteção contra CSRF
- `maxAge: ONE_YEAR_MS` - Validade de 1 ano

#### 3. Contexto de Autenticação

A cada requisição tRPC, o contexto extrai o usuário do JWT:

```typescript
// server/_core/context.ts
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
```

#### 4. Proteção de Rotas

No frontend, rotas protegidas verificam autenticação:

```typescript
// client/src/App.tsx
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Component {...rest} /> : null;
}
```

### Segurança

O KanFlow implementa múltiplas camadas de segurança:

#### Headers de Segurança

O Helmet.js adiciona headers de segurança HTTP:

```typescript
app.use(helmet());
```

Headers inclusos:

- `X-Content-Type-Options: nosniff` - Previne MIME type sniffing
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-XSS-Protection: 1; mode=block` - Proteção contra XSS
- `Strict-Transport-Security` - Força HTTPS

#### CORS

CORS é configurado para permitir apenas origens confiáveis:

```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

#### Rate Limiting

Express Rate Limit previne brute force:

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requisições por IP
});

app.use('/api/', limiter);
```

#### Validação de Input

Zod valida todos os inputs tRPC:

```typescript
create: protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(255),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/),
    email: z.string().email().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Input garantidamente válido aqui
  })
```

#### Sanitização

Inputs são sanitizados antes de serem armazenados:

- Remoção de scripts maliciosos
- Trimming de espaços em branco
- Validação de URLs
- Escape de caracteres especiais

---

## Frontend - Componentes e Páginas

### Estrutura de Componentes

O frontend utiliza uma arquitetura de componentes hierárquica com separação clara de responsabilidades.

#### Componentes de Layout

##### DashboardLayout

Componente principal que envolve todas as páginas autenticadas. Fornece sidebar, header e footer.

```typescript
// client/src/components/DashboardLayout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Renderiza sidebar, header, children, footer
}
```

Características:

- Sidebar com navegação principal
- Header com informações do usuário
- Footer com créditos
- Responsivo para mobile
- Suporte a tema claro/escuro

#### Componentes shadcn/ui

O projeto utiliza componentes pré-construídos do shadcn/ui:

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| Button | `components/ui/button.tsx` | Botões interativos |
| Card | `components/ui/card.tsx` | Containers de conteúdo |
| Input | `components/ui/input.tsx` | Campos de entrada |
| Dialog | `components/ui/dialog.tsx` | Modais |
| Tabs | `components/ui/tabs.tsx` | Abas de navegação |
| Table | `components/ui/table.tsx` | Tabelas de dados |
| Select | `components/ui/select.tsx` | Dropdowns |
| Checkbox | `components/ui/checkbox.tsx` | Checkboxes |
| RadioGroup | `components/ui/radio-group.tsx` | Radio buttons |
| Tooltip | `components/ui/tooltip.tsx` | Dicas ao passar mouse |

### Páginas Principais

#### 1. Login.tsx

Página de autenticação com abas para diferentes métodos de login.

**Abas implementadas:**

- **Entrar:** Login com email e senha
- **Criar Conta:** Registro de novo usuário
- **Recuperar Senha:** Reset de senha por email

**Características:**

- Layout 2 colunas (desktop): Branding à esquerda, formulário à direita
- Features listadas com ícones
- Badges de segurança (LGPD, Criptografado)
- Gradiente azul/cyan no fundo
- Responsivo para mobile
- Toggle de visibilidade de senha
- Validação de formulários com React Hook Form

**Código relevante:**

```typescript
<Tabs defaultValue="login" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="login">Entrar</TabsTrigger>
    <TabsTrigger value="signup">Criar Conta</TabsTrigger>
    <TabsTrigger value="reset">Recuperar</TabsTrigger>
  </TabsList>
  
  <TabsContent value="login">
    {/* Formulário de login */}
  </TabsContent>
  
  <TabsContent value="signup">
    {/* Formulário de registro */}
  </TabsContent>
  
  <TabsContent value="reset">
    {/* Formulário de reset */}
  </TabsContent>
</Tabs>
```

#### 2. Dashboard.tsx

Página principal com métricas e gráficos interativos.

**Componentes:**

- 4 cards de métricas (Total Contatos, Mensagens, Taxa Conversão, Contatos Ativos)
- 4 gráficos Recharts:
  - Funil de Vendas (barras verticais coloridas)
  - Mensagens últimos 7 dias (linha temporal)
  - Distribuição por Etapa (pizza com legenda)
  - Taxa de Conversão por Etapa (barras horizontais)

**Dados:**

```typescript
const { data: stats } = trpc.dashboard.stats.useQuery();
```

#### 3. Pipeline.tsx

Kanban board para gestão visual de contatos.

**Características:**

- Drag & drop de contatos entre etapas
- Etapas personalizáveis
- Visualização de funil
- Filtros e busca
- Métricas por etapa

**Implementação:**

Utiliza `@dnd-kit` para drag & drop:

```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

<DndContext onDragEnd={handleDragEnd}>
  {stages.map(stage => (
    <SortableContext items={contactsByStage[stage.id]}>
      {/* Cards de contatos */}
    </SortableContext>
  ))}
</DndContext>
```

#### 4. Contacts.tsx

Gestão completa de contatos com CRUD.

**Funcionalidades:**

- Lista de contatos com tabela
- Criar novo contato
- Editar contato existente
- Deletar contato
- Busca e filtros
- Visualizar histórico de mensagens

**Componentes:**

- Tabela de contatos
- Modal de criação/edição
- Dialog de confirmação de deleção

#### 5. Chats.tsx

Interface de mensagens com contatos.

**Características:**

- Lista de conversas
- Chat window com histórico
- Envio de mensagens
- Sugestões de IA
- Notificações em tempo real

#### 6. Settings.tsx

Configurações de usuário e aplicação.

**Seções:**

- Perfil do usuário
- Preferências de notificações
- Tema (claro/escuro)
- Privacidade e LGPD
- Sobre a aplicação

#### 7. AdminPanel.tsx

Painel administrativo para gestão multi-tenant.

**Funcionalidades:**

- Gestão de organizações
- Controle de assinaturas
- Billing e pagamentos
- Métricas de uso
- Logs de auditoria

**Acesso:** Apenas para usuários com `role: "admin"`

#### 8. AIAgents.tsx

Configuração e gerenciamento de agentes de IA.

**Características:**

- Criar novos agentes
- Configurar prompts
- Testar respostas
- Histórico de interações

#### 9. Automations.tsx

Criação de automações com triggers e ações.

**Funcionalidades:**

- Criar fluxos automáticos
- Definir triggers (nova mensagem, novo contato, etc)
- Definir ações (enviar mensagem, criar tarefa, etc)
- Ativar/desativar automações
- Histórico de execuções

### Hooks Customizados

#### useAuth()

Hook para acessar estado de autenticação:

```typescript
const { user, loading, error, isAuthenticated, logout } = useAuth();
```

**Retorno:**

```typescript
{
  user: User | null;           // Dados do usuário
  loading: boolean;            // Carregando
  error: Error | null;         // Erro
  isAuthenticated: boolean;    // Autenticado
  logout: () => Promise<void>; // Função de logout
}
```

#### useTheme()

Hook para gerenciar tema (claro/escuro):

```typescript
const { theme, toggleTheme } = useTheme();
```

### Estilização

#### TailwindCSS

O projeto utiliza TailwindCSS 4 para estilização:

```typescript
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
  <h1 className="text-2xl font-bold text-primary">KanFlow</h1>
</div>
```

#### Paleta de Cores

Definida em `client/src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 210 40% 98%;
  --secondary: 180 100% 50%;
  --destructive: 0 84.2% 60.2%;
  /* ... mais cores ... */
}
```

#### Componentes Customizados

Componentes shadcn/ui podem ser customizados:

```typescript
<Button 
  variant="outline"
  size="lg"
  className="w-full"
>
  Clique aqui
</Button>
```

Variantes disponíveis: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

---

## Backend - Servidores e Routers

### Servidor Express

O servidor Express é configurado em `server/_core/index.ts`:

```typescript
async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(helmet());
  app.use(cors({ credentials: true }));
  
  // OAuth
  registerOAuthRoutes(app);
  
  // tRPC
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Vite (dev) ou static (prod)
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  server.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}/`);
  });
}
```

### Routers tRPC

Os routers são organizados por domínio em `server/routers.ts`:

#### Auth Router

```typescript
auth: router({
  me: publicProcedure.query(opts => opts.ctx.user ?? null),
  
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),

  demoLogin: publicProcedure
    .input(z.object({ role: z.enum(["admin", "user"]) }))
    .mutation(async ({ ctx, input }) => {
      // Cria sessão de demo
    }),
})
```

#### Pipeline Router

```typescript
const pipelineRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getPipelineStages(ctx.user.id);
  }),
  
  create: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const stages = await db.getPipelineStages(ctx.user.id);
      return db.createPipelineStage({
        id: nanoid(),
        name: input.name,
        color: input.color || "#3b82f6",
        order: stages.length,
        userId: ctx.user.id,
      });
    }),
});
```

#### Contacts Router

```typescript
const contactsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getContacts(ctx.user.id);
  }),
  
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      phoneNumber: z.string(),
      email: z.string().optional(),
      stageId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.createContact({
        id: nanoid(),
        name: input.name,
        phoneNumber: input.phoneNumber,
        email: input.email || null,
        stageId: input.stageId || null,
        userId: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      stageId: z.string().optional(),
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.updateContact(input.id, {
        stageId: input.stageId,
        name: input.name,
      });
    }),
});
```

#### Messages Router

```typescript
const messagesRouter = router({
  list: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      return db.getMessages(input.contactId);
    }),

  create: protectedProcedure
    .input(z.object({
      contactId: z.string(),
      content: z.string(),
      direction: z.enum(["inbound", "outbound"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.createMessage({
        id: nanoid(),
        contactId: input.contactId,
        content: input.content,
        direction: input.direction,
        sentBy: ctx.user.id,
      });
    }),
});
```

#### Dashboard Router

```typescript
const dashboardRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await db.getContacts(ctx.user.id);
    const stages = await db.getPipelineStages(ctx.user.id);
    
    return {
      totalContacts: contacts.length,
      totalStages: stages.length,
      contactsByStage: stages.map(stage => ({
        stageName: stage.name,
        count: contacts.filter(c => c.stageId === stage.id).length,
      })),
    };
  }),
});
```

#### AI Router

```typescript
const aiRouter = router({
  analyzeMessage: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      // Implementar com LLM
      return {
        sentiment: "neutral",
        category: "general",
        priority: "normal",
      };
    }),

  suggestResponse: protectedProcedure
    .input(z.object({ messageContent: z.string(), contactName: z.string() }))
    .mutation(async ({ input }) => {
      // Implementar com LLM
      return {
        suggestedResponse: `Olá ${input.contactName}, obrigado por sua mensagem.`,
        confidence: 0.85,
      };
    }),
});
```

### Funções de Banco de Dados

Implementadas em `server/db.ts`:

```typescript
// Users
export async function getUser(id: string)
export async function upsertUser(user: InsertUser): Promise<void>

// Pipeline Stages
export async function getPipelineStages(userId: string)
export async function createPipelineStage(stage: InsertPipelineStage)

// Contacts
export async function getContacts(userId: string)
export async function createContact(contact: InsertContact)
export async function updateContact(id: string, updates: Partial<InsertContact>)

// Messages
export async function getMessages(contactId: string)
export async function createMessage(message: InsertMessage)
```

Todas as funções utilizam Drizzle ORM para queries type-safe:

```typescript
export async function getContacts(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt));
}
```

---

## Funcionalidades Principais

### 1. Dashboard

O dashboard fornece uma visão geral do negócio com métricas e gráficos interativos.

#### Métricas Principais

- **Total de Contatos:** Número total de leads/clientes
- **Mensagens:** Total de mensagens enviadas/recebidas
- **Taxa de Conversão:** Percentual de contatos que avançaram no pipeline
- **Contatos Ativos:** Contatos com mensagens nos últimos 7 dias

#### Gráficos

1. **Funil de Vendas:** Distribuição de contatos por etapa (barras verticais)
2. **Timeline de Mensagens:** Mensagens por dia (últimos 7 dias)
3. **Distribuição por Etapa:** Pie chart com proporção de contatos
4. **Taxa de Conversão:** Conversão por etapa (barras horizontais)

#### Implementação

```typescript
export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Contatos" value={stats.totalContacts} />
          {/* ... mais cards ... */}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart data={stats} />
          <TimelineChart data={stats} />
          {/* ... mais gráficos ... */}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

### 2. Pipeline Kanban

Sistema visual de gestão de contatos em formato Kanban.

#### Características

- **Drag & Drop:** Mover contatos entre etapas
- **Etapas Customizáveis:** Criar, editar, deletar etapas
- **Cores Personalizadas:** Cada etapa tem uma cor
- **Filtros:** Filtrar por nome, etapa, data
- **Métricas:** Visualizar quantidade de contatos por etapa

#### Implementação

```typescript
export default function Pipeline() {
  const { data: stages } = trpc.pipeline.list.useQuery();
  const { data: contacts } = trpc.contacts.list.useQuery();
  const updateContactMutation = trpc.contacts.update.useMutation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const contactId = active.id as string;
      const stageId = over.id as string;
      
      updateContactMutation.mutate({
        id: contactId,
        stageId: stageId,
      });
    }
  };

  return (
    <DashboardLayout>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {stages?.map(stage => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <h3 className="font-semibold mb-4">{stage.name}</h3>
              <SortableContext items={contacts
                .filter(c => c.stageId === stage.id)
                .map(c => c.id)
              }>
                {/* Cards de contatos */}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </DashboardLayout>
  );
}
```

### 3. Gestão de Contatos

CRUD completo de contatos com histórico de interações.

#### Operações

- **Criar:** Adicionar novo contato com nome, telefone, email
- **Ler:** Visualizar lista de contatos com detalhes
- **Atualizar:** Editar informações do contato
- **Deletar:** Remover contato do sistema

#### Campos de Contato

- Nome (obrigatório)
- Telefone/WhatsApp (obrigatório)
- Email (opcional)
- Etapa do pipeline
- Avatar/Foto
- Notas internas
- Última mensagem
- Data de criação

#### Implementação

```typescript
export default function Contacts() {
  const { data: contacts } = trpc.contacts.list.useQuery();
  const createMutation = trpc.contacts.create.useMutation();
  const updateMutation = trpc.contacts.update.useMutation();

  const handleCreate = (data: CreateContactInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        trpc.useUtils().contacts.list.invalidate();
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button onClick={() => setShowCreateDialog(true)}>
          Novo Contato
        </Button>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.map(contact => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.stageId}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Editar</Button>
                  <Button variant="ghost" size="sm">Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
```

### 4. Sistema de Mensagens

Histórico completo de mensagens com contatos.

#### Características

- **Chat Window:** Interface de chat com histórico
- **Envio de Mensagens:** Enviar novas mensagens
- **Status de Entrega:** Visualizar status (enviado, entregue, lido)
- **Sugestões de IA:** Sugerir respostas automáticas
- **Notificações:** Notificar sobre novas mensagens

#### Implementação

```typescript
export default function Chats() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  
  const { data: contacts } = trpc.contacts.list.useQuery();
  const { data: messages } = trpc.messages.list.useQuery(
    { contactId: selectedContactId! },
    { enabled: !!selectedContactId }
  );
  
  const createMessageMutation = trpc.messages.create.useMutation();
  const suggestResponseMutation = trpc.ai.suggestResponse.useMutation();

  const handleSendMessage = (content: string) => {
    if (!selectedContactId) return;
    
    createMessageMutation.mutate({
      contactId: selectedContactId,
      content,
      direction: "outbound",
    });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-screen">
        {/* Lista de contatos */}
        <div className="border-r">
          {contacts?.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className="p-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
            </div>
          ))}
        </div>

        {/* Chat window */}
        {selectedContactId && (
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages?.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.direction === 'outbound' ? 'text-right' : ''}`}
                >
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.direction === 'outbound' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensagem */}
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Digite uma mensagem..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```

### 5. Autenticação e Login

Sistema robusto de autenticação com múltiplos métodos.

#### Métodos de Login

1. **OAuth (Manus):** Login integrado com Manus
2. **Email/Senha:** Login com credenciais (futuro)
3. **Demo:** Login de demonstração para testes

#### Página de Login

A página de login foi redesenhada com abas para melhor UX:

- **Aba 1 - Entrar:** Login com email/senha ou Manus Auth
- **Aba 2 - Criar Conta:** Registro de novo usuário
- **Aba 3 - Recuperar Senha:** Reset de senha por email

#### Implementação

```typescript
export default function Login() {
  const handleMausLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              <TabsTrigger value="reset">Recuperar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {/* Formulário de login */}
              <Button onClick={handleMausLogin} className="w-full">
                Login com Manus Auth
              </Button>
            </TabsContent>

            <TabsContent value="signup">
              {/* Formulário de registro */}
            </TabsContent>

            <TabsContent value="reset">
              {/* Formulário de reset */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Fluxos de Dados

### Fluxo de Criação de Contato

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário preenche formulário de novo contato              │
│    - Nome, telefone, email, etapa                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend valida com Zod                                  │
│    - Verifica tipos e formatos                              │
│    - Mostra erros se inválido                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend chama trpc.contacts.create.useMutation()       │
│    - Envia dados para o servidor                            │
│    - Mostra loading state                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend recebe em protectedProcedure                     │
│    - Valida autenticação                                    │
│    - Valida input com Zod                                   │
│    - Gera ID único com nanoid()                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend executa db.createContact()                       │
│    - Insere contato no MySQL                                │
│    - Retorna contato criado                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend recebe resposta                                 │
│    - Invalida cache com trpc.useUtils()                     │
│    - Refetch automático da lista                            │
│    - Mostra toast de sucesso                                │
│    - Fecha modal/formulário                                 │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Envio de Mensagem

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário digita mensagem e pressiona Enter                │
│    - Valida que não está vazia                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend chama trpc.messages.create.useMutation()       │
│    - Envia contactId, content, direction="outbound"         │
│    - Limpa input field                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend insere mensagem no banco                         │
│    - Cria registro com status "sent"                        │
│    - Retorna mensagem criada                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend atualiza chat window                            │
│    - Invalida cache de mensagens                            │
│    - Refetch automático                                     │
│    - Scroll para última mensagem                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. WebSocket notifica outros clientes (futuro)              │
│    - Emite evento socket.io                                 │
│    - Clientes recebem em tempo real                         │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Drag & Drop no Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário inicia drag de um card de contato                │
│    - DndContext detecta dragStart                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Usuário move o card sobre outra etapa                    │
│    - Visual feedback (highlight da etapa)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuário solta o card (dragEnd)                           │
│    - DndContext dispara onDragEnd                           │
│    - Extrai contactId e stageId                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend chama trpc.contacts.update.useMutation()       │
│    - Envia id do contato e novo stageId                     │
│    - Atualiza UI otimisticamente                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend atualiza contato no banco                        │
│    - UPDATE contacts SET stageId = ? WHERE id = ?           │
│    - Retorna contato atualizado                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend confirma atualização                            │
│    - Invalida cache                                         │
│    - Refetch automático                                     │
│    - Mostra toast de sucesso                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment e DevOps

### Ambientes

O KanFlow suporta três ambientes:

#### 1. Desenvolvimento (Development)

```bash
pnpm dev
```

- Vite dev server em `http://localhost:3000`
- Hot Module Replacement (HMR) ativo
- Seed de dados de demo automático
- TypeScript em modo watch
- Logs detalhados

#### 2. Staging (Opcional)

Ambiente de teste antes de produção:

```bash
pnpm build
pnpm start
```

#### 3. Produção (Production)

Deployment em Vercel ou servidor próprio:

```bash
NODE_ENV=production pnpm start
```

- Build otimizado
- Minificação de assets
- Compressão de respostas
- Cache headers configurados

### Deployment na Vercel

Vercel é a plataforma recomendada para deployment do KanFlow.

#### Configuração

O arquivo `vercel.json` configura o deployment:

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "vite",
  "nodeVersion": "22.x",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret"
  },
  "rewrites": [
    {
      "source": "/api/trpc/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

#### Passos para Deploy

1. **Preparar repositório GitHub:**
   ```bash
   git add .
   git commit -m "Pronto para deploy"
   git push origin main
   ```

2. **Conectar no Vercel:**
   - Acessar https://vercel.com
   - Clicar "New Project"
   - Selecionar repositório GitHub
   - Configurar variáveis de ambiente

3. **Configurar variáveis de ambiente:**
   - `DATABASE_URL` - String de conexão MySQL
   - `JWT_SECRET` - Chave secreta para JWT
   - `VITE_APP_TITLE` - Título da aplicação
   - `VITE_APP_LOGO` - URL do logo

4. **Deploy:**
   - Vercel faz build automático
   - Testa a aplicação
   - Deploy para produção

#### Monitoramento

Após o deployment, monitorar:

- **Logs:** Vercel Dashboard → Deployments → Logs
- **Performance:** Vercel Analytics
- **Erros:** Sentry (opcional)
- **Uptime:** Uptime monitoring (opcional)

### CI/CD com GitHub Actions

O projeto pode incluir GitHub Actions para automação:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Variáveis de Ambiente

### Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão MySQL | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Chave secreta para JWT (min 32 chars) | `seu-secret-muito-seguro-aqui` |
| `VITE_APP_ID` | ID da aplicação Manus | `seu-app-id` |
| `VITE_APP_TITLE` | Título da aplicação | `KanFlow - CRM WhatsApp` |
| `VITE_APP_LOGO` | URL do logo | `https://seu-dominio.com/logo.png` |

### Opcionais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `PORT` | Porta do servidor | `3000` |
| `VITE_ANALYTICS_ENDPOINT` | Endpoint de analytics | - |
| `VITE_ANALYTICS_WEBSITE_ID` | ID do website para analytics | - |
| `OPENAI_API_KEY` | Chave da API OpenAI (futuro) | - |
| `WHATSAPP_API_KEY` | Chave da API WhatsApp (futuro) | - |

### Arquivo .env

Criar arquivo `.env` na raiz do projeto:

```bash
# Database
DATABASE_URL=mysql://user:password@localhost:3306/kanflow_crm

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura-com-32-caracteres-minimo

# App
VITE_APP_ID=seu-app-id-manus
VITE_APP_TITLE=KanFlow - CRM WhatsApp
VITE_APP_LOGO=https://seu-dominio.com/kanflow-logo.png

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.seu-dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu-website-id

# OpenAI (futuro)
# OPENAI_API_KEY=sk-proj-xxxxx
# OPENAI_API_URL=https://api.openai.com/v1

# WhatsApp (futuro)
# WHATSAPP_API_KEY=sua-chave-whatsapp
# WHATSAPP_PHONE_NUMBER_ID=seu-phone-id
```

**⚠️ Nunca commitar `.env` no Git!** Use `.env.example` para documentar variáveis necessárias.

---

## Scripts e Comandos

### Desenvolvimento

```bash
# Inicia servidor de desenvolvimento com HMR
pnpm dev

# Verifica tipos TypeScript
pnpm check

# Formata código com Prettier
pnpm format

# Executa testes
pnpm test
```

### Build e Produção

```bash
# Build para produção
pnpm build

# Inicia servidor de produção
pnpm start

# Build + start
pnpm build && pnpm start
```

### Database

```bash
# Gera migrations e executa
pnpm db:push

# Apenas gera migrations (sem executar)
pnpm db:generate

# Apenas executa migrations
pnpm db:migrate

# Abre Drizzle Studio (UI para banco)
pnpm db:studio
```

### Limpeza

```bash
# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf dist

# Remove cache
rm -rf .next .turbo

# Reinstala dependências
pnpm install
```

---

## Troubleshooting

### Problemas Comuns

#### 1. "Cannot find module '@shared/const'"

**Causa:** Aliases de TypeScript não configurados corretamente

**Solução:**
```bash
# Verificar tsconfig.json
cat tsconfig.json | grep -A 5 "paths"

# Deve conter:
# "@shared/*": ["./shared/*"]
```

#### 2. "Database connection failed"

**Causa:** `DATABASE_URL` inválida ou banco indisponível

**Solução:**
```bash
# Verificar variável de ambiente
echo $DATABASE_URL

# Testar conexão
mysql -u user -p -h host -P 3306 -D database

# Verificar credenciais no .env
cat .env | grep DATABASE_URL
```

#### 3. "JWT token expired"

**Causa:** Session expirou ou JWT_SECRET mudou

**Solução:**
```bash
# Fazer logout e login novamente
# Limpar cookies do navegador
# Verificar JWT_SECRET no .env
```

#### 4. "Port 3000 is already in use"

**Causa:** Outra aplicação usando a porta

**Solução:**
```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 pnpm dev
```

#### 5. "Vite HMR connection failed"

**Causa:** Problema de conexão WebSocket

**Solução:**
```bash
# Verificar vite.config.ts
# Adicionar allowedHosts se necessário

# Limpar cache do navegador
# Ctrl+Shift+Delete (Chrome)
# Cmd+Shift+Delete (Firefox)
```

#### 6. "tRPC query returns undefined"

**Causa:** Procedimento retornando undefined

**Solução:**
```typescript
// Sempre retornar valor ou null explicitamente
me: publicProcedure.query(opts => opts.ctx.user ?? null)

// Não fazer:
// me: publicProcedure.query(opts => opts.ctx.user)
```

#### 7. "Drag & drop não funciona"

**Causa:** @dnd-kit não inicializado corretamente

**Solução:**
```typescript
// Verificar que DndContext envolve SortableContext
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={items}>
    {/* Conteúdo */}
  </SortableContext>
</DndContext>
```

### Logs e Debug

#### Logs do Frontend

```typescript
// Ativar logs de tRPC
import { loggerLink } from '@trpc/client';

const trpcClient = createTRPCClient({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    // ... outros links
  ],
});
```

#### Logs do Backend

```typescript
// Adicionar logs em routers
create: protectedProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ ctx, input }) => {
    console.log('[Contacts] Creating contact:', input);
    const result = await db.createContact({...});
    console.log('[Contacts] Created:', result);
    return result;
  })
```

#### Logs do Banco de Dados

```typescript
// Ativar logs do Drizzle
import { drizzle } from 'drizzle-orm/mysql2';

const db = drizzle(connection, {
  logger: true, // Mostra todas as queries SQL
});
```

---

## Roadmap Técnico

### Versão 1.0 (Atual) ✅

- [x] Dashboard com métricas e gráficos
- [x] Pipeline Kanban com drag & drop
- [x] Gestão de contatos (CRUD)
- [x] Sistema de mensagens
- [x] Autenticação JWT com OAuth
- [x] Conformidade LGPD
- [x] Painel administrativo
- [x] Login com abas

### Versão 1.1 (Próxima) 🔜

- [ ] Integração WhatsApp Business API
- [ ] Envio/recebimento de mensagens reais
- [ ] Webhooks WhatsApp
- [ ] Templates de mensagens
- [ ] Notificações em tempo real (WebSocket)
- [ ] Sistema de automações

### Versão 1.2 (Futuro) 🚀

- [ ] Integração OpenAI
- [ ] Análise de sentimento com IA
- [ ] Sugestão automática de respostas
- [ ] Chatbots inteligentes
- [ ] Agentes de automação avançados
- [ ] Relatórios e analytics avançados

### Versão 2.0 (Planejado) 💡

- [ ] App mobile (React Native)
- [ ] Integração com outros canais (Email, Instagram, Telegram)
- [ ] API pública para integrações
- [ ] Marketplace de integrações
- [ ] Workflow builder visual
- [ ] Machine learning para previsão de vendas

---

## Conclusão

O KanFlow CRM é uma plataforma robusta e profissional para gestão de relacionamento com clientes, com foco em WhatsApp e automação inteligente. Este manual técnico fornece uma visão completa da arquitetura, APIs, componentes e funcionalidades do sistema.

Para mais informações, consulte:

- **README.md** - Documentação geral
- **Código-fonte** - Implementações específicas
- **GitHub Issues** - Rastreamento de bugs e features
- **Suporte** - suporte@aedadigital.com.br

---

## Referências

1. [React Documentation](https://react.dev)
2. [TypeScript Handbook](https://www.typescriptlang.org/docs/)
3. [tRPC Documentation](https://trpc.io)
4. [Drizzle ORM](https://orm.drizzle.team)
5. [Express.js Guide](https://expressjs.com)
6. [TailwindCSS](https://tailwindcss.com)
7. [Shadcn/ui Components](https://ui.shadcn.com)
8. [Vite Documentation](https://vitejs.dev)
9. [MySQL Documentation](https://dev.mysql.com/doc/)
10. [Vercel Deployment](https://vercel.com/docs)
11. [JWT.io](https://jwt.io)
12. [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

**Desenvolvido com ❤️ por Studio AEDA Digital**

**Versão:** 1.0.0  
**Data:** Novembro de 2024  
**Licença:** MIT

