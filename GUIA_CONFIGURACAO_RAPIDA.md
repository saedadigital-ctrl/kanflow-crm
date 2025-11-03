# ⚡ Guia Rápido de Configuração - KanFlow CRM

**Tempo estimado:** 15-20 minutos

---

## 📋 Checklist Rápido

- [ ] Supabase criado e tabelas configuradas
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Aplicação testada

---

## 1️⃣ Configurar Supabase (5 minutos)

### Passo 1: Criar Projeto

```
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - Project Name: kanflow-crm
   - Database Password: (gere uma senha forte)
   - Region: South America - São Paulo
4. Clique "Create new project"
5. Aguarde 2-3 minutos
```

### Passo 2: Obter Credenciais

```
1. Acesse Settings → Database
2. Copie a URL de Connection Pooling (pgBouncer):
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
3. Guarde essa URL para o Vercel
```

### Passo 3: Criar Tabelas

```
1. Acesse SQL Editor
2. Cole o conteúdo de: SUPABASE_MIGRATIONS.sql
3. Clique "Run" para executar
4. Aguarde a conclusão
```

**Resultado esperado:** 6 tabelas criadas (users, pipeline_stages, contacts, messages, notifications, audit_logs)

---

## 2️⃣ Configurar Vercel (10 minutos)

### Passo 1: Conectar Repositório

```
1. Acesse https://vercel.com
2. Clique "New Project"
3. Selecione "Import Git Repository"
4. Busque por: kanflow-crm
5. Clique "Import"
```

### Passo 2: Configurar Variáveis de Ambiente

Na tela de configuração, clique em "Environment Variables" e adicione:

```
DATABASE_URL = postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

JWT_SECRET = (gere uma chave aleatória com 32+ caracteres)
Exemplo: openssl rand -base64 32

VITE_APP_ID = seu-app-id-manus

VITE_APP_TITLE = KanFlow - CRM WhatsApp

VITE_APP_LOGO = https://seu-dominio.com/kanflow-logo.png

OAUTH_SERVER_URL = https://api.manus.im

VITE_OAUTH_PORTAL_URL = https://login.manus.im

OWNER_OPEN_ID = seu-open-id

OWNER_NAME = Seu Nome

BUILT_IN_FORGE_API_URL = https://api.manus.im

BUILT_IN_FORGE_API_KEY = sua-chave-api-manus

VITE_FRONTEND_FORGE_API_URL = https://api.manus.im

VITE_FRONTEND_FORGE_API_KEY = sua-chave-api-manus
```

### Passo 3: Deploy

```
1. Clique "Deploy"
2. Aguarde 3-5 minutos
3. Você verá: "Congratulations! Your project has been successfully deployed"
4. Clique no link para acessar: https://kanflow-crm.vercel.app
```

---

## 3️⃣ Testar Aplicação (5 minutos)

### Teste 1: Acessar Página de Login

```
1. Acesse: https://kanflow-crm.vercel.app
2. Você deve ver a página de login com abas
3. Verifique as 3 abas: "Entrar", "Criar Conta", "Recuperar"
```

### Teste 2: Fazer Login

```
1. Clique em "Entrar"
2. Clique em "Login com Manus Auth"
3. Faça login com suas credenciais Manus
4. Você deve ser redirecionado para o Dashboard
```

### Teste 3: Verificar Dashboard

```
1. Você deve ver 4 cards de métricas
2. Você deve ver 4 gráficos interativos
3. Dados devem estar carregando (pode levar alguns segundos)
```

### Teste 4: Testar Pipeline

```
1. Clique em "Pipeline" no menu lateral
2. Você deve ver as etapas do funil
3. Tente arrastar um contato entre etapas
```

### Teste 5: Testar Contatos

```
1. Clique em "Contatos" no menu lateral
2. Clique em "Novo Contato"
3. Preencha: Nome, Telefone, Email
4. Clique "Criar"
5. Contato deve aparecer na lista
```

---

## 🔧 Variáveis de Ambiente Explicadas

| Variável | O que é | Onde obter |
|----------|---------|-----------|
| `DATABASE_URL` | URL de conexão do Supabase | Supabase → Settings → Database |
| `JWT_SECRET` | Chave para assinar tokens | Gere com: `openssl rand -base64 32` |
| `VITE_APP_ID` | ID da aplicação Manus | Painel Manus → Aplicações |
| `VITE_APP_TITLE` | Título da aplicação | Você define |
| `VITE_APP_LOGO` | URL do logo | Hospede em CDN ou seu servidor |
| `OAUTH_SERVER_URL` | Servidor OAuth Manus | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | Portal de login Manus | `https://login.manus.im` |
| `OWNER_OPEN_ID` | ID único do proprietário | Seu ID no Manus |
| `OWNER_NAME` | Nome do proprietário | Seu nome |
| `BUILT_IN_FORGE_API_KEY` | Chave da API Manus | Painel Manus → API Keys |
| `BUILT_IN_FORGE_API_URL` | URL da API Manus | `https://api.manus.im` |

---

## ❌ Troubleshooting Rápido

### Problema: "Database connection refused"

**Solução:**
```
1. Verifique DATABASE_URL no Vercel
2. Certifique-se de que copiou a URL de POOLING (não a regular)
3. Verifique se a senha está correta
```

### Problema: "Build failed"

**Solução:**
```
1. Acesse Vercel → Deployments → Logs
2. Procure pela mensagem de erro
3. Verifique se todas as variáveis estão configuradas
4. Tente fazer novo deploy: Vercel → Redeploy
```

### Problema: "Login não funciona"

**Solução:**
```
1. Verifique VITE_OAUTH_PORTAL_URL
2. Verifique VITE_APP_ID
3. Certifique-se de que o redirect URI está configurado em Manus:
   https://kanflow-crm.vercel.app/api/oauth/callback
```

### Problema: "Dashboard vazio"

**Solução:**
```
1. Abra DevTools (F12)
2. Vá para Console
3. Procure por erros de rede
4. Verifique se o banco de dados tem dados
5. Tente fazer login novamente
```

---

## 📊 Verificar Status

### Verificar se Vercel está online

```bash
curl https://kanflow-crm.vercel.app/health
```

Resposta esperada:
```json
{"status":"ok","timestamp":"2024-11-03T..."}
```

### Verificar se Supabase está online

```bash
psql postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
SELECT * FROM users;
```

### Verificar logs do Vercel

```
1. Acesse https://vercel.com
2. Selecione o projeto kanflow-crm
3. Clique em "Deployments"
4. Clique no deployment mais recente
5. Clique em "Logs"
```

---

## 🎯 Próximos Passos

### Imediato (hoje)

- [ ] Testar todas as funcionalidades
- [ ] Criar alguns contatos de teste
- [ ] Testar drag & drop no Pipeline
- [ ] Testar envio de mensagens

### Curto Prazo (esta semana)

- [ ] Configurar domínio customizado
- [ ] Configurar analytics
- [ ] Fazer backup do banco de dados
- [ ] Configurar monitoramento de erros (Sentry)

### Médio Prazo (este mês)

- [ ] Integrar WhatsApp Business API
- [ ] Configurar automações (N8n)
- [ ] Integrar IA (OpenAI)
- [ ] Criar documentação de usuário

---

## 📞 Suporte

Se tiver problemas:

1. **Verifique os logs:**
   - Vercel: Deployments → Logs
   - Supabase: SQL Editor → Histórico
   - Navegador: F12 → Console

2. **Consulte a documentação:**
   - MANUAL_TECNICO.md - Documentação técnica completa
   - SETUP_VERCEL_SUPABASE.md - Guia detalhado
   - GitHub Issues - Problemas conhecidos

3. **Entre em contato:**
   - 📧 Email: suporte@aedadigital.com.br
   - 💬 WhatsApp: [em breve]

---

## ✅ Checklist Final

Após completar a configuração, verifique:

- [ ] Aplicação acessível em https://kanflow-crm.vercel.app
- [ ] Login funcionando com OAuth
- [ ] Dashboard carregando dados
- [ ] Pipeline Kanban operacional
- [ ] Contatos sendo criados/editados/deletados
- [ ] Mensagens sendo enviadas/recebidas
- [ ] Banco de dados sincronizado
- [ ] Logs do Vercel sem erros
- [ ] Performance otimizada (Lighthouse > 80)

---

**Parabéns! 🎉 Seu KanFlow CRM está pronto para produção!**

Desenvolvido com ❤️ por Studio AEDA Digital

