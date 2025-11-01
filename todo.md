# KanFlow CRM - Project TODO

## Completed Features ✅

- [x] Dashboard com métricas e gráficos interativos
- [x] Pipeline Kanban com drag & drop
- [x] Gestão de contatos (CRUD completo)
- [x] Autenticação JWT com proteção de rotas
- [x] Conformidade LGPD com políticas e consentimento
- [x] Painel administrativo para gestão multi-tenant
- [x] Auditoria completa com logs de ações
- [x] Build e deploy no GitHub Pages
- [x] GitHub Actions workflow para CI/CD automático
- [x] Branding KanFlow (logo, favicon, cores)
- [x] Responsividade e design system
- [x] Segurança e proteção de dados

## Bugs & Issues

- [ ] TypeScript errors em Organizations.tsx (isLoading property)
  - Arquivo: client/src/pages/admin/Organizations.tsx
  - Linhas: 375, 376
  - Descrição: Property 'isLoading' não existe em UseTRPCMutationResult
  - Status: Requer correção de tipos tRPC

## Planned Features 🔜

- [ ] Integração WhatsApp Business API
- [ ] Envio/recebimento de mensagens
- [ ] Webhooks WhatsApp
- [ ] Templates de mensagens
- [ ] Integração OpenAI para IA
- [ ] Agentes de automação
- [ ] Respostas automáticas
- [ ] Chatbots inteligentes
- [ ] Análise de sentimento

## Deployment Status 🚀

- [x] Build local com Vite
- [x] GitHub repository configurado
- [x] GitHub Actions workflow criado
- [x] GitHub Pages ativo
- [x] Deploy automático funcionando
- [ ] Domínio customizado (em progresso)
- [ ] Documentação de deployment (em progresso)

## URLs

- **GitHub Repository**: https://github.com/saedadigital-ctrl/kanflow-crm
- **GitHub Pages**: https://saedadigital-ctrl.github.io/kanflow-crm/
- **Production**: (domínio customizado a configurar)



## Sistema de Notificações em Tempo Real 🔔

- [ ] Criar schema de notificações no banco de dados
  - [ ] Tabela `notifications` (id, userId, type, title, body, entityType, entityId, channel, readAt, createdAt)
  - [ ] Tabela `notification_preferences` (userId, enableSound, muteFrom, muteTo, whatsappMessage, kanbanMove, contactUpdate, channels)
  - [ ] Migrations Drizzle

- [ ] Implementar serviço de notificações no backend
  - [ ] NotificationService com método emit()
  - [ ] EventEmitter para whatsapp.message.received, kanban.card.moved, contact.created/updated
  - [ ] Respeitar preferências de usuário
  - [ ] Salvar notificações no banco

- [ ] Configurar WebSocket para comunicação em tempo real
  - [ ] Integrar Socket.io ou ws nativo
  - [ ] Namespace /realtime com rooms user:{userId} e team:{teamId}
  - [ ] Autenticação de usuário via JWT
  - [ ] Broadcast de eventos para usuários autorizados

- [ ] Criar hooks e componentes React para notificações
  - [ ] Hook useNotifications() para conectar ao WebSocket
  - [ ] Componente Toast com Sonner
  - [ ] Componente Badge com contador
  - [ ] Dropdown de notificações recentes

- [ ] Integrar notificações com eventos de WhatsApp e Kanban
  - [ ] Emitir evento ao receber mensagem WhatsApp
  - [ ] Emitir evento ao mover card no Kanban
  - [ ] Emitir evento ao criar/atualizar contato

- [ ] Criar UI para gerenciar preferências de notificações
  - [ ] Página de Preferências com toggles
  - [ ] Página "Todas as Notificações" com filtros e busca
  - [ ] Marcar notificações como lidas
  - [ ] Configurar som e horário de silêncio

- [ ] Testar sistema de notificações
  - [ ] Testar WebSocket em desenvolvimento
  - [ ] Testar persistência de notificações
  - [ ] Testar preferências de usuário
  - [ ] Testar em múltiplas abas/janelas

