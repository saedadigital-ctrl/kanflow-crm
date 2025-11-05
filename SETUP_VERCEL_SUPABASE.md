# 🚀 Guia de Setup - Vercel + Supabase

**Versão:** 1.0.0  
**Data:** Novembro de 2024  
**Autor:** Studio AEDA Digital

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Supabase](#configuração-do-supabase)
4. [Configuração do Vercel](#configuração-do-vercel)
5. [Sincronização GitHub → Vercel](#sincronização-github--vercel)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Testes e Validação](#testes-e-validação)
8. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este guia descreve como configurar o KanFlow CRM para funcionar perfeitamente com:

- **GitHub:** Repositório de código-fonte
- **Vercel:** Hosting e deployment automático
- **Supabase:** Banco de dados PostgreSQL gerenciado

### Arquitetura

```
┌─────────────────┐
│     GitHub      │
│  (Repositório)  │
└────────┬────────┘
         │
         │ Webhook
         ↓
┌─────────────────┐       ┌──────────────────┐
│     Vercel      │◄─────►│    Supabase      │
│  (Deployment)   │       │  (PostgreSQL)    │
└─────────────────┘       └──────────────────┘
         │
         ↓
    Produção
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Conta no GitHub (com repositório criado)
- ✅ Conta no Vercel (https://vercel.com)
- ✅ Conta no Supabase (https://supabase.com)
- ✅ Tokens de acesso gerados
- ✅ Node.js 22+ instalado localmente

---

## Configuração do Supabase

### Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Project Name:** `kanflow-crm`
   - **Database Password:** (gere uma senha forte)
   - **Region:** Selecione a mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"

### Passo 2: Aguardar Inicialização

O projeto levará alguns minutos para ser criado. Você verá uma barra de progresso.

### Passo 3: Obter Credenciais

Após a criação, acesse **Settings → Database**:

```
Connection String (URI):
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

Connection Pooling (pgBouncer):
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Importante:** Use a URL com pooling para Vercel (melhor performance).

### Passo 4: Criar Tabelas

Acesse **SQL Editor** e execute o script abaixo:

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline stages table
CREATE TABLE pipeline_stages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INT NOT NULL,
  color VARCHAR(7) DEFAULT '#3b82f6',
  user_id VARCHAR(64) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE contacts (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(320),
  avatar_url TEXT,
  notes TEXT,
  stage_id VARCHAR(64) REFERENCES pipeline_stages(id),
  user_id VARCHAR(64) NOT NULL REFERENCES users(id),
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id VARCHAR(64) PRIMARY KEY,
  contact_id VARCHAR(64) NOT NULL REFERENCES contacts(id),
  content TEXT NOT NULL,
  direction VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  media_url TEXT,
  media_type VARCHAR(50),
  sent_by VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pipeline_stages_user_id ON pipeline_stages(user_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_stage_id ON contacts(stage_id);
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
```

### Passo 5: Obter API Keys

Acesse **Settings → API**:

- **Project URL:** `https://[PROJECT_ID].supabase.co`
- **Anon Key:** (chave pública para frontend)
- **Service Role Key:** (chave privada para backend)

Guarde essas informações para usar no Vercel.

---

## Configuração do Vercel

### Passo 1: Conectar Repositório GitHub

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Busque por `kanflow-crm`
5. Clique em "Import"

### Passo 2: Configurar Variáveis de Ambiente

Na página de configuração do projeto, acesse **Environment Variables** e adicione:

```bash
# Database
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura-com-minimo-32-caracteres

# App
VITE_APP_ID=seu-app-id-manus
VITE_APP_TITLE=KanFlow - CRM WhatsApp
VITE_APP_LOGO=https://seu-dominio.com/kanflow-logo.png

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Owner (opcional)
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-manus

# Frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-manus

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.seu-dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

### Passo 3: Configurar Build

Na página de configuração:

- **Framework Preset:** Vite
- **Build Command:** `pnpm build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`

### Passo 4: Deploy

Clique em "Deploy" e aguarde a conclusão.

---

## Sincronização GitHub → Vercel

### Fluxo Automático

Após a configuração inicial, o Vercel sincroniza automaticamente:

```
1. Você faz push para GitHub
   git push origin main

2. GitHub dispara webhook para Vercel

3. Vercel faz build automático
   - Instala dependências
   - Compila TypeScript
   - Build Vite
   - Executa testes (opcional)

4. Deploy automático para produção
   - URL: https://kanflow-crm.vercel.app
   - Domínio customizado (se configurado)

5. Banco de dados sincronizado
   - Migrations automáticas (se configuradas)
   - Dados persistidos no Supabase
```

### Configurar Domínio Customizado (Opcional)

1. No Vercel, acesse **Settings → Domains**
2. Clique em "Add Domain"
3. Digite seu domínio (ex: `crm.aedadigital.com.br`)
4. Configure DNS no seu provedor:
   ```
   CNAME: cname.vercel-dns.com
   ```

---

## Variáveis de Ambiente

### Arquivo .env.local (Desenvolvimento)

Crie na raiz do projeto:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/kanflow_crm

# JWT
JWT_SECRET=sua-chave-secreta-desenvolvimento

# App
VITE_APP_ID=seu-app-id
VITE_APP_TITLE=KanFlow - CRM WhatsApp
VITE_APP_LOGO=/kanflow-logo.png

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Owner
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api

# Frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api
```

### Arquivo .env.production (Vercel)

Configure no Vercel Dashboard → Settings → Environment Variables

---

## Testes e Validação

### Teste 1: Verificar Deploy

```bash
# Acessar a aplicação
https://kanflow-crm.vercel.app

# Verificar logs
vercel logs --tail
```

### Teste 2: Verificar Banco de Dados

```bash
# Conectar ao Supabase
psql postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# Listar tabelas
\dt

# Verificar dados
SELECT * FROM users;
```

### Teste 3: Testar Funcionalidades

1. **Login:**
   - Acessar página de login
   - Clicar em "Login com Manus Auth"
   - Fazer login com credenciais

2. **Dashboard:**
   - Verificar se métricas carregam
   - Verificar se gráficos renderizam

3. **Pipeline:**
   - Criar novo contato
   - Mover contato entre etapas
   - Verificar se dados persistem

4. **Contatos:**
   - Listar contatos
   - Criar novo contato
   - Editar contato
   - Deletar contato

5. **Mensagens:**
   - Enviar mensagem
   - Verificar histórico
   - Testar sugestões de IA

### Teste 4: Verificar Performance

```bash
# Lighthouse (Chrome DevTools)
# Acessar: https://kanflow-crm.vercel.app
# F12 → Lighthouse → Analyze page load

# Esperado:
# Performance: > 80
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

---

## Troubleshooting

### Problema 1: "Database connection refused"

**Causa:** DATABASE_URL inválida ou banco indisponível

**Solução:**
```bash
# Verificar URL no Supabase
# Settings → Database → Connection String

# Testar conexão localmente
psql "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Verificar variável no Vercel
vercel env list
```

### Problema 2: "Build failed: Module not found"

**Causa:** Dependências não instaladas corretamente

**Solução:**
```bash
# Limpar cache do Vercel
vercel build --no-cache

# Ou no dashboard: Settings → Git → Clear Build Cache
```

### Problema 3: "Deployment stuck"

**Causa:** Build muito lento ou timeout

**Solução:**
```bash
# Aumentar timeout (se possível)
# Ou otimizar build:
# - Remover dependências desnecessárias
# - Usar dynamic imports
# - Otimizar imagens
```

### Problema 4: "OAuth callback fails"

**Causa:** VITE_OAUTH_PORTAL_URL incorreta ou redirect URI não configurada

**Solução:**
```bash
# Verificar variável no Vercel
echo $VITE_OAUTH_PORTAL_URL

# Configurar redirect URI no Manus
# https://kanflow-crm.vercel.app/api/oauth/callback
```

### Problema 5: "Migrations não executadas"

**Causa:** DATABASE_URL não configurada ou migrations não automáticas

**Solução:**
```bash
# Executar manualmente no Supabase SQL Editor
# Copiar scripts de drizzle/migrations/

# Ou via CLI:
pnpm db:push
```

---

## Checklist de Deployment

- [ ] Repositório GitHub criado e código enviado
- [ ] Projeto Supabase criado com tabelas
- [ ] Projeto Vercel criado e conectado ao GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build bem-sucedido no Vercel
- [ ] Aplicação acessível em produção
- [ ] Login funcionando com OAuth
- [ ] Dashboard carregando dados
- [ ] Pipeline Kanban operacional
- [ ] Contatos sendo criados/editados/deletados
- [ ] Mensagens sendo enviadas/recebidas
- [ ] Banco de dados sincronizado
- [ ] Performance otimizada (Lighthouse > 80)
- [ ] Logs monitorados
- [ ] Domínio customizado configurado (opcional)

---

## Próximos Passos

1. **Integração WhatsApp:**
   - Configurar WhatsApp Business API
   - Implementar webhooks
   - Testar envio/recebimento de mensagens

2. **Automações:**
   - Configurar N8n ou Make.com
   - Criar workflows automáticos
   - Integrar com IA

3. **Monitoramento:**
   - Configurar Sentry para erros
   - Configurar analytics
   - Monitorar performance

4. **Segurança:**
   - Configurar WAF (Web Application Firewall)
   - Implementar rate limiting
   - Backup automático do banco

---

## Suporte

Para dúvidas ou problemas:

- 📧 Email: suporte@aedadigital.com.br
- 💬 WhatsApp: [em breve]
- 📚 Documentação: https://github.com/saedadigital-ctrl/kanflow-crm

---

**Desenvolvido com ❤️ por Studio AEDA Digital**

