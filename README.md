# 🚀 KanFlow - CRM WhatsApp com Kanban

<div align="center">

**Sistema CRM Profissional para Gestão de Contatos WhatsApp**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://whatsapp-crm-kanban-m35rok19g-adriano-castros-projects-338bc319.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/saedadigital-ctrl/kanflow-crm)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Sobre o Projeto

O **KanFlow** é um CRM (Customer Relationship Management) moderno e profissional, desenvolvido especificamente para gestão de contatos e conversas do WhatsApp em formato Kanban. Inspirado no Kommo CRM, oferece uma interface intuitiva e poderosa para equipes de vendas e atendimento.

### 🎯 Principais Funcionalidades

- ✅ **Dashboard Completo** com métricas e gráficos interativos
- ✅ **Pipeline Kanban** com drag & drop para gestão visual
- ✅ **Gestão de Contatos** com histórico completo
- ✅ **Autenticação Segura** com JWT e proteção de rotas
- ✅ **Conformidade LGPD** com políticas e consentimento
- ✅ **Painel Administrativo** para gestão multi-tenant
- ✅ **Auditoria Completa** com logs de todas as ações
- 🔜 **Integração WhatsApp Business API**
- 🔜 **Automações com IA** (OpenAI)
- 🔜 **Respostas Automáticas** e chatbots

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS 4** - Estilização
- **Shadcn/ui** - Componentes
- **Recharts** - Gráficos interativos
- **tRPC** - Type-safe API client
- **Wouter** - Roteamento

### Backend
- **Node.js** - Runtime
- **Express 4** - Framework web
- **tRPC 11** - Type-safe API
- **Drizzle ORM** - Database ORM
- **JWT** - Autenticação
- **Zod** - Validação de schemas

### Database
- **PostgreSQL** - Banco principal (Supabase)
- **MySQL** - Alternativa suportada

### DevOps
- **Vercel** - Hosting e deployment
- **GitHub** - Controle de versão
- **pnpm** - Gerenciador de pacotes

---

## 🚀 Deploy e Instalação

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL ou MySQL

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/saedadigital-ctrl/kanflow-crm.git
cd kanflow-crm

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente (veja seção abaixo)

# Execute as migrations
pnpm db:push

# Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

### Deploy na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/saedadigital-ctrl/kanflow-crm)

1. Clique no botão acima
2. Configure as variáveis de ambiente
3. Aguarde o deploy automático

---

## ⚙️ Configuração

### Variáveis de Ambiente Obrigatórias

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=sua-chave-secreta-min-32-caracteres

# App
VITE_APP_TITLE=KanFlow - CRM WhatsApp
VITE_APP_LOGO=https://seu-dominio.com/logo.svg
```

### Variáveis Opcionais

```bash
# OpenAI (para IA)
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_API_URL=https://api.openai.com/v1

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.exemplo.com
VITE_ANALYTICS_WEBSITE_ID=seu-website-id

# WhatsApp (futuro)
WHATSAPP_API_KEY=sua-chave
WHATSAPP_PHONE_NUMBER_ID=seu-phone-id
```

---

## 📊 Estrutura do Projeto

```
kanflow-crm/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas
│   │   ├── components/    # Componentes
│   │   ├── lib/          # Bibliotecas
│   │   └── index.css     # Estilos globais
│   └── public/           # Assets estáticos
├── server/                # Backend Node.js
│   ├── routers/          # Rotas tRPC
│   ├── db.ts             # Queries
│   └── _core/            # Core
├── drizzle/              # Schema e migrations
├── shared/               # Código compartilhado
└── vercel.json           # Config Vercel
```

---

## 🎨 Design System

### Paleta de Cores

- **Azul Primário:** `#1E40AF` - Blue Professional
- **Azul Secundário:** `#06B6D4` - Cyan
- **Verde Sucesso:** `#10B981` - Green
- **Fundo:** `#F8FAFC` - Light Gray

### Tipografia

- **Fonte Principal:** Inter
- **Fonte Mono:** JetBrains Mono

---

## 📈 Funcionalidades Detalhadas

### Dashboard

- 4 cards de métricas principais
- 4 gráficos interativos (Recharts)
- Funil de vendas visual
- Timeline de mensagens
- Distribuição por etapa
- Taxa de conversão

### Pipeline Kanban

- Drag & drop de contatos
- Etapas personalizáveis
- Filtros e busca
- Visualização de funil
- Métricas por etapa

### Gestão de Contatos

- CRUD completo
- Histórico de mensagens
- Tags e categorias
- Busca avançada
- Exportação de dados

### Segurança e LGPD

- Autenticação JWT
- Proteção de rotas
- Modal de consentimento
- Política de Privacidade
- Termos de Uso
- Auditoria de logs
- Direitos do titular (Art. 18 LGPD)

### Painel Administrativo

- Gestão de organizações
- Controle de assinaturas
- Billing e pagamentos
- Métricas de uso
- Logs de auditoria

---

## 🔐 Segurança

- ✅ JWT para autenticação
- ✅ Proteção de rotas
- ✅ HTTPS automático
- ✅ Headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Auditoria de logs
- ✅ Conformidade LGPD
- ✅ Criptografia de senhas
- ✅ Sanitização de inputs

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Build
pnpm build        # Build para produção

# Produção
pnpm start        # Inicia servidor de produção

# Database
pnpm db:push      # Executa migrations

# Qualidade
pnpm check        # Type checking
pnpm format       # Formata código
pnpm test         # Executa testes
```

---

## 🗺️ Roadmap

### Versão 1.0 (Atual) ✅
- [x] Dashboard completo
- [x] Pipeline Kanban
- [x] Gestão de contatos
- [x] Autenticação
- [x] LGPD compliance
- [x] Painel administrativo

### Versão 1.1 (Em Breve) 🔜
- [ ] Integração WhatsApp Business API
- [ ] Envio/recebimento de mensagens
- [ ] Webhooks WhatsApp
- [ ] Templates de mensagens

### Versão 1.2 (Futuro) 🚀
- [ ] Integração OpenAI
- [ ] Agentes de automação
- [ ] Respostas automáticas
- [ ] Chatbots inteligentes
- [ ] Análise de sentimento

### Versão 2.0 (Planejado) 💡
- [ ] App mobile (React Native)
- [ ] Integração com outros canais
- [ ] Relatórios avançados
- [ ] API pública
- [ ] Marketplace de integrações

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

**Desenvolvido por Studio AEDA Digital**

- Email: contato@aedadigital.com.br
- Suporte: suporte@aedadigital.com.br

---

## 📞 Suporte

Precisa de ajuda? Entre em contato:

- 📧 Email: suporte@aedadigital.com.br
- 💬 WhatsApp: [em breve]
- 📚 Documentação: [em breve]

---

## 🙏 Agradecimentos

- [Kommo CRM](https://www.kommo.com/) - Inspiração para o design
- [Vercel](https://vercel.com/) - Hosting e deployment
- [Supabase](https://supabase.com/) - Database hosting
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI

---

<div align="center">

**Desenvolvido com ❤️ por Studio AEDA Digital**

[![Website](https://img.shields.io/badge/Website-Em%20Breve-blue?style=for-the-badge)](https://aedadigital.com.br)
[![Email](https://img.shields.io/badge/Email-contato@aedadigital.com.br-red?style=for-the-badge)](mailto:contato@aedadigital.com.br)

</div>

