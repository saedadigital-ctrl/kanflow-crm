# 📋 KanFlow CRM - Todo List

**Objetivo:** Transformar KanFlow em uma plataforma SaaS profissional e pronta para produção

**Versão:** 2.0 - Implementação Completa (Multi-tenant, RLS, WhatsApp, Billing, Design System, N8n, Mobile)

---

## 🎯 FASE 1: Multi-Tenant + RLS (ESTA SEMANA)

### Database Schema
- [ ] Criar tabela `organizations` no Supabase
- [ ] Criar tabela `organization_members` para gerenciar membros
- [ ] Criar tabela `organization_invites` para convites
- [ ] Migrar dados de `users` para estrutura multi-tenant
- [ ] Criar índices para performance
- [ ] Criar função `auth_org_id()` para obter org do usuário logado

### Row Level Security (RLS)
- [ ] Habilitar RLS em todas as tabelas
- [ ] Criar políticas para `organizations` (leitura/escrita por membro)
- [ ] Criar políticas para `contacts` (isolamento por org)
- [ ] Criar políticas para `deals` (isolamento por org)
- [ ] Criar políticas para `conversations` (isolamento por org)
- [ ] Criar políticas para `messages` (isolamento por org)
- [ ] Testar RLS com múltiplos usuários/orgs

### Backend (tRPC)
- [ ] Atualizar schema Drizzle com novas tabelas
- [ ] Criar db helpers para organizations
- [ ] Criar procedures tRPC para:
  - [ ] `org.list` - Listar organizações do usuário
  - [ ] `org.create` - Criar nova organização
  - [ ] `org.update` - Atualizar organização
  - [ ] `org.delete` - Deletar organização
  - [ ] `org.members.list` - Listar membros
  - [ ] `org.members.add` - Adicionar membro
  - [ ] `org.members.remove` - Remover membro
  - [ ] `org.members.updateRole` - Mudar role

### Frontend
- [ ] Criar componente `OrganizationSelector`
- [ ] Implementar seletor de organização no header
- [ ] Atualizar contexto de autenticação com org_id
- [ ] Criar página de Organizações
- [ ] Criar página de Membros
- [ ] Criar modal de Convite de Membros
- [ ] Atualizar todas as queries tRPC para incluir org_id

### Testing
- [ ] Testar RLS com múltiplos usuários
- [ ] Testar isolamento de dados por organização
- [ ] Testar permissões de acesso
- [ ] Fazer checkpoint

---

## 🎯 FASE 2: WhatsApp Config + Conversations (ESTA SEMANA)

### Database Schema
- [ ] Criar tabela `whatsapp_configs` (phone_number, access_token, business_account_id, etc)
- [ ] Criar tabela `conversations` (contact_id, status, last_snippet, unread_count)
- [ ] Criar índices para performance
- [ ] Implementar RLS para whatsapp_configs
- [ ] Implementar RLS para conversations

### Views para Métricas
- [ ] Criar view `v_conversations_today` - Conversas de hoje por org
- [ ] Criar view `v_active_contacts` - Contatos com conversa ativa
- [ ] Criar view `v_response_rate` - Taxa de resposta (últimas 24h)
- [ ] Criar view `v_pipeline_counts` - Contagem de deals por etapa
- [ ] Criar view `v_waiting_overdue` - Conversas aguardando > 15min
- [ ] Criar view `v_conversation_metrics` - Métricas gerais

### Backend (tRPC)
- [ ] Criar db helpers para whatsapp_configs
- [ ] Criar procedures tRPC para:
  - [ ] `whatsapp.config.get` - Obter configuração
  - [ ] `whatsapp.config.save` - Salvar configuração
  - [ ] `whatsapp.config.test` - Testar conexão
  - [ ] `conversations.list` - Listar conversas
  - [ ] `conversations.get` - Obter conversa
  - [ ] `conversations.updateStatus` - Atualizar status
  - [ ] `conversations.markAsRead` - Marcar como lida

### Frontend
- [ ] Criar página WhatsApp Setup
- [ ] Implementar form de configuração WhatsApp
- [ ] Adicionar instruções passo-a-passo
- [ ] Criar componente de Status de Conexão
- [ ] Atualizar Dashboard com métricas de conversas
- [ ] Criar página de Conversations (lista)
- [ ] Criar página de Chat (conversa individual)

### Integration (Mock)
- [ ] Criar mock de WhatsApp Business API
- [ ] Testar fluxo completo de mensagens
- [ ] Preparar para integração real

### Testing
- [ ] Testar RLS para whatsapp_configs
- [ ] Testar isolamento de conversas
- [ ] Testar métricas
- [ ] Fazer checkpoint

---

## 🎯 FASE 3: Billing + KPIs (PRÓXIMA SEMANA)

### Database Schema
- [ ] Criar tabela `subscriptions` (org_id, plan, status, current_period_start/end)
- [ ] Criar tabela `billing_history` (org_id, amount, status, stripe_id)
- [ ] Criar tabela `usage_logs` (org_id, metric, count, date)
- [ ] Implementar RLS para subscriptions
- [ ] Implementar RLS para billing_history

### Views para KPIs
- [ ] Criar view `v_org_usage` - Uso por organização
- [ ] Criar view `v_revenue_by_plan` - Receita por plano
- [ ] Criar view `v_churn_rate` - Taxa de cancelamento
- [ ] Criar view `v_mrr` - Monthly Recurring Revenue

### Backend (tRPC)
- [ ] Criar db helpers para subscriptions
- [ ] Criar procedures tRPC para:
  - [ ] `billing.subscription.get` - Obter subscription
  - [ ] `billing.subscription.update` - Atualizar plano
  - [ ] `billing.subscription.cancel` - Cancelar
  - [ ] `billing.history.list` - Histórico de pagamentos
  - [ ] `billing.usage.get` - Obter uso atual

### Stripe Integration
- [ ] Configurar Stripe API keys
- [ ] Criar webhook para eventos Stripe
- [ ] Implementar checkout
- [ ] Implementar customer portal
- [ ] Testar pagamentos

### Frontend
- [ ] Criar página de Billing
- [ ] Criar página de Planos
- [ ] Implementar seletor de plano
- [ ] Criar componente de Upgrade/Downgrade
- [ ] Atualizar Dashboard com uso/quotas
- [ ] Mostrar limite de uso por plano

### Testing
- [ ] Testar fluxo de pagamento
- [ ] Testar webhook Stripe
- [ ] Testar quotas
- [ ] Fazer checkpoint

---

## 🎯 FASE 4: Design System Figma (PRÓXIMA SEMANA)

### Tokens
- [ ] Definir tokens de cores:
  - [ ] brand/primary = #1E40AF
  - [ ] brand/accent = #06B6D4
  - [ ] success = #10B981
  - [ ] warning = #F59E0B
  - [ ] danger = #EF4444
  - [ ] gray (50-900)
- [ ] Definir tokens de tipografia:
  - [ ] H1 32/40 semi
  - [ ] H2 24/32 semi
  - [ ] H3 20/28 semi
  - [ ] Body 16/24 reg
  - [ ] Caption 12/16 reg
- [ ] Definir tokens de espaçamento (4, 8, 12, 16, 24, 32)
- [ ] Definir tokens de shadows
- [ ] Definir tokens de radius (4, 8, 12, 16)

### Componentes
- [ ] Button (primary, secondary, ghost, danger)
- [ ] Input (text, email, password, com helper)
- [ ] Select/Dropdown
- [ ] Checkbox, Radio, Switch
- [ ] Card, Badge, Alert
- [ ] Modal, Drawer, Toast
- [ ] Table, Tabs, Accordion
- [ ] Avatar, Badge Status
- [ ] Progress, Skeleton
- [ ] Kanban Card

### Templates
- [ ] Template: Login
- [ ] Template: Dashboard
- [ ] Template: Contacts Table
- [ ] Template: Pipeline Kanban
- [ ] Template: Conversations
- [ ] Template: WhatsApp Setup
- [ ] Template: Settings
- [ ] Template: Admin Overview
- [ ] Template: Billing

### Documentation
- [ ] Documentar design system
- [ ] Criar guia de uso
- [ ] Exportar componentes para código
- [ ] Fazer checkpoint

---

## 🎯 FASE 5: N8n Automations (PRÓXIMA SEMANA)

### Setup
- [ ] Configurar N8n (self-hosted ou cloud)
- [ ] Configurar conexão com Supabase
- [ ] Configurar conexão com OpenAI
- [ ] Configurar webhook para receber eventos

### Workflows
- [ ] **Workflow 1:** Novo contato → Notificar via email
- [ ] **Workflow 2:** Mensagem recebida → Atualizar status conversa
- [ ] **Workflow 3:** Conversa aguardando > 15min → Notificar agente
- [ ] **Workflow 4:** Novo cliente → Criar tarefa no CRM
- [ ] **Workflow 5:** Sugerir resposta com IA → Enviar para agente
- [ ] **Workflow 6:** Análise de sentimento → Atualizar prioridade
- [ ] **Workflow 7:** Backup automático → Fazer backup do banco

### Integrations
- [ ] Integração com Supabase (read/write)
- [ ] Integração com OpenAI (análise, geração)
- [ ] Integração com Gmail (envio de emails)
- [ ] Integração com Slack (notificações)
- [ ] Integração com WhatsApp (mock)
- [ ] Integração com Webhook (receber eventos)

### Frontend
- [ ] Criar página de Automations
- [ ] Listar workflows disponíveis
- [ ] Criar UI para ativar/desativar workflows
- [ ] Mostrar histórico de execuções
- [ ] Criar logs de automações

### Testing
- [ ] Testar cada workflow
- [ ] Testar integrações
- [ ] Testar performance
- [ ] Fazer checkpoint

---

## 🎯 FASE 6: React Native Mobile (PRÓXIMA SEMANA)

### Setup
- [ ] Criar projeto React Native com Expo
- [ ] Configurar navegação (React Navigation)
- [ ] Configurar autenticação
- [ ] Configurar tRPC client para mobile

### Telas
- [ ] Login
- [ ] Dashboard (resumo de métricas)
- [ ] Conversations (lista)
- [ ] Chat (conversa individual)
- [ ] Contacts (lista)
- [ ] Contact Detail
- [ ] Settings
- [ ] Profile

### Features
- [ ] Autenticação com OAuth
- [ ] Sincronização de dados
- [ ] Push notifications
- [ ] Offline support
- [ ] Biometric auth
- [ ] Dark mode

### Testing
- [ ] Testar em iOS (simulador)
- [ ] Testar em Android (simulador)
- [ ] Testar performance
- [ ] Fazer checkpoint

---

## 🎯 FASE 7: Admin SaaS Panel (PRÓXIMA SEMANA)

### Pages
- [ ] Dashboard Admin (KPIs gerais)
- [ ] Gerenciador de Organizações
- [ ] Gerenciador de Usuários
- [ ] Gerenciador de Subscriptions
- [ ] Relatório de Uso
- [ ] Logs de Auditoria
- [ ] Analytics
- [ ] Settings

### Features
- [ ] Overview com métricas:
  - [ ] Total de organizações
  - [ ] Total de usuários
  - [ ] MRR (Monthly Recurring Revenue)
  - [ ] Churn rate
  - [ ] Uso de API
  - [ ] Uso de storage
- [ ] Busca e filtros
- [ ] Exportar dados
- [ ] Impersonar usuário
- [ ] Gerenciar planos

### Testing
- [ ] Testar acesso (apenas admin)
- [ ] Testar operações CRUD
- [ ] Testar relatórios
- [ ] Fazer checkpoint

---

## 🎯 FASE 8: Testes + Deployment (PRÓXIMA SEMANA)

### Testes
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração (API)
- [ ] Testes E2E (Playwright)
- [ ] Testes de performance (Lighthouse)
- [ ] Testes de segurança (OWASP)
- [ ] Testes de RLS
- [ ] Testes de multi-tenant

### CI/CD
- [ ] Configurar GitHub Actions
- [ ] Executar testes automaticamente
- [ ] Build automático
- [ ] Deploy automático

### Deployment
- [ ] Deploy em produção
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/TLS
- [ ] Configurar CDN

### Monitoring
- [ ] Configurar Sentry para erros
- [ ] Configurar LogRocket
- [ ] Configurar analytics
- [ ] Configurar alertas

### Documentation
- [ ] Atualizar README.md
- [ ] Criar guia de contribuição
- [ ] Documentar API (OpenAPI)
- [ ] Criar guia de deployment
- [ ] Criar guia de troubleshooting
- [ ] Fazer checkpoint final

---

## 🔧 Features Técnicas Transversais

- [ ] Implementar logging estruturado
- [ ] Configurar rate limiting
- [ ] Implementar cache (Redis)
- [ ] Configurar backups automáticos
- [ ] Implementar versionamento de API
- [ ] Configurar CORS corretamente
- [ ] Implementar CSRF protection
- [ ] Configurar CSP headers
- [ ] Implementar validação de entrada
- [ ] Implementar sanitização de dados

---

## 📊 Status Geral

| Fase | Status | Progresso |
|------|--------|-----------|
| 1 - Multi-tenant + RLS | 🔴 Não iniciado | 0% |
| 2 - WhatsApp + Conversations | 🔴 Não iniciado | 0% |
| 3 - Billing + KPIs | 🔴 Não iniciado | 0% |
| 4 - Design System Figma | 🔴 Não iniciado | 0% |
| 5 - N8n Automations | 🔴 Não iniciado | 0% |
| 6 - React Native Mobile | 🔴 Não iniciado | 0% |
| 7 - Admin SaaS Panel | 🔴 Não iniciado | 0% |
| 8 - Testes + Deployment | 🔴 Não iniciado | 0% |

---

**Última atualização:** Novembro 03, 2024  
**Próximo checkpoint:** Após Fase 1

