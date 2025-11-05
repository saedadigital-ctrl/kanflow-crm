# 🚀 Checklist de Deploy - KanFlow CRM

## 1. GitHub - Sincronização de Código

### Status Atual
- ✅ Repositório GitHub criado: `https://github.com/saedadigital-ctrl/kanflow-crm`
- ✅ Remote GitHub configurado
- ✅ GitHub Actions workflow criado (`.github/workflows/deploy.yml`)
- ⚠️ Branch local 15 commits à frente do origin/main

### O que Fazer
1. **Sincronizar Git Local com GitHub**
   ```bash
   git push github main
   ```
   - Isso enviará todos os commits locais para o repositório GitHub
   - Requer autenticação GitHub (SSH key ou Personal Access Token)

2. **Verificar GitHub Actions**
   - Ir para: `https://github.com/saedadigital-ctrl/kanflow-crm/actions`
   - Confirmar que o workflow `Deploy to GitHub Pages` foi acionado
   - Aguardar conclusão (geralmente 2-5 minutos)

3. **Verificar GitHub Pages**
   - Ir para: `https://github.com/saedadigital-ctrl/kanflow-crm/settings/pages`
   - Confirmar que está publicando do branch `gh-pages`
   - URL pública: `https://saedadigital-ctrl.github.io/kanflow-crm/`

### Variáveis de Ambiente (GitHub)
- ✅ Não são necessárias para GitHub Pages (apenas frontend estático)
- ℹ️ Se integrar backend, adicionar secrets em `Settings > Secrets and variables > Actions`

---

## 2. Vercel - Deploy do Backend & Frontend

### Status Atual
- ✅ Projeto Vercel criado: `whatsapp-crm-kanban`
- ✅ Project ID: `prj_2MctQKr4N2ICjbsAHC0gShSXPgfS`
- ✅ vercel.json configurado com buildCommand e routes
- ⚠️ Variáveis de ambiente não configuradas

### O que Fazer

#### 1. Conectar GitHub ao Vercel
1. Ir para: `https://vercel.com/dashboard`
2. Selecionar projeto `whatsapp-crm-kanban`
3. Ir para `Settings > Git`
4. Conectar repositório GitHub: `saedadigital-ctrl/kanflow-crm`
5. Configurar branch de deploy: `main`

#### 2. Configurar Variáveis de Ambiente no Vercel
Ir para `Settings > Environment Variables` e adicionar:

**Variáveis Obrigatórias:**
- `DATABASE_URL` - String de conexão MySQL (ex: `mysql://user:pass@host:3306/db`)
- `JWT_SECRET` - Chave secreta para JWT (ex: `your-secret-key-min-32-chars`)
- `VITE_APP_ID` - ID da aplicação Manus OAuth
- `OAUTH_SERVER_URL` - URL do servidor OAuth Manus
- `VITE_OAUTH_PORTAL_URL` - URL do portal OAuth Manus
- `BUILT_IN_FORGE_API_URL` - URL da API Manus
- `BUILT_IN_FORGE_API_KEY` - Chave da API Manus

**Variáveis Opcionais:**
- `VITE_APP_TITLE` - Título da aplicação (padrão: "KanFlow")
- `VITE_APP_LOGO` - URL do logo (padrão: `/kanflow-logo-solid.png`)
- `VITE_ANALYTICS_ENDPOINT` - Endpoint de analytics
- `VITE_ANALYTICS_WEBSITE_ID` - ID do website analytics
- `OWNER_NAME` - Nome do proprietário
- `OWNER_OPEN_ID` - ID aberto do proprietário
- `STRIPE_SECRET_KEY` - Chave secreta Stripe (se usar pagamentos)
- `STRIPE_WEBHOOK_SECRET` - Webhook secret Stripe (se usar pagamentos)

#### 3. Configurar Build & Deploy
1. Ir para `Settings > Build & Development Settings`
2. Verificar:
   - **Build Command**: `pnpm build` ✅
   - **Output Directory**: `dist/public` ✅
   - **Install Command**: `pnpm install` ✅
   - **Development Command**: `pnpm dev` ✅

#### 4. Fazer Deploy
1. Opção A: Push para GitHub (automático)
   ```bash
   git push github main
   ```
   - Vercel detectará a mudança e fará deploy automaticamente

2. Opção B: Deploy Manual
   - Ir para `https://vercel.com/dashboard/whatsapp-crm-kanban`
   - Clicar em "Redeploy" ou "Deploy"

#### 5. Verificar Deploy
- Aguardar conclusão (geralmente 2-5 minutos)
- Verificar logs em `Deployments` tab
- Testar URL pública: `https://whatsapp-crm-kanban.vercel.app` (ou domínio customizado)

---

## 3. Domínio Customizado (Opcional)

### Para Vercel
1. Ir para `Settings > Domains`
2. Adicionar domínio customizado
3. Seguir instruções de DNS

### Para GitHub Pages
1. Ir para `Settings > Pages`
2. Adicionar domínio customizado
3. Seguir instruções de DNS

---

## 4. Checklist Final

### Antes de Deploy
- [ ] Código sincronizado com GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local testado: `pnpm build`
- [ ] Dev server testado: `pnpm dev`
- [ ] Logo carregando sem erros de CORS
- [ ] Landing page com imagens profissionais

### Durante Deploy
- [ ] GitHub Actions workflow executado com sucesso
- [ ] Vercel build completado sem erros
- [ ] Logs verificados em ambas plataformas

### Após Deploy
- [ ] GitHub Pages acessível: `https://saedadigital-ctrl.github.io/kanflow-crm/`
- [ ] Vercel acessível: `https://whatsapp-crm-kanban.vercel.app`
- [ ] Logo carregando corretamente em produção
- [ ] Nenhum erro de CORS no console
- [ ] Funcionalidades básicas testadas

---

## 5. Troubleshooting

### Erro: "Failed to push to GitHub"
- Solução: Configurar SSH key ou Personal Access Token
- Comando: `git push github main`

### Erro: "Build failed on Vercel"
- Verificar logs em `Deployments > Build Logs`
- Confirmar que todas as variáveis de ambiente estão configuradas
- Testar build local: `pnpm build`

### Erro: "CORS error on logo"
- ✅ Já resolvido - usando caminho local `/kanflow-logo-solid.png`

### Erro: "Database connection failed"
- Verificar `DATABASE_URL` no Vercel
- Confirmar que banco de dados está acessível de fora
- Testar conexão local: `pnpm db:push`

---

## 6. Próximos Passos

1. **Imediato**: Sincronizar código com GitHub
2. **Curto Prazo**: Configurar variáveis de ambiente no Vercel
3. **Médio Prazo**: Fazer deploy em produção
4. **Longo Prazo**: Monitorar logs e performance

