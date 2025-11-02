# Guia de Deploy do KanFlow no Vercel

## Pré-requisitos

1. **Conta no GitHub** - Para hospedar o repositório
2. **Conta no Vercel** - Para fazer o deploy
3. **Banco de Dados** - MySQL ou TiDB (recomendado: PlanetScale ou Supabase)
4. **Manus OAuth** - Configurado e com credenciais

## Passo 1: Preparar o Repositório GitHub

### 1.1 Criar repositório no GitHub
```bash
# Se ainda não tiver um repositório
git init
git add .
git commit -m "Initial commit: KanFlow CRM"
git branch -M main
git remote add origin https://github.com/seu-usuario/kanflow.git
git push -u origin main
```

### 1.2 Verificar arquivos importantes
- ✅ `package.json` - Dependências
- ✅ `tsconfig.json` - Configuração TypeScript
- ✅ `vite.config.ts` - Configuração Vite
- ✅ `.env.example` - Exemplo de variáveis
- ✅ `drizzle/schema.ts` - Schema do banco

## Passo 2: Configurar Banco de Dados

### 2.1 Opção A: PlanetScale (Recomendado)
```bash
# 1. Criar conta em https://planetscale.com
# 2. Criar novo database "kanflow"
# 3. Copiar connection string
# 4. Usar como DATABASE_URL
```

### 2.2 Opção B: Supabase
```bash
# 1. Criar conta em https://supabase.com
# 2. Criar novo projeto
# 3. Copiar connection string PostgreSQL
# 4. Usar como DATABASE_URL
```

### 2.3 Opção C: Seu próprio MySQL
```bash
# Usar sua URL MySQL existente
DATABASE_URL=mysql://user:password@host:3306/kanflow
```

## Passo 3: Configurar Vercel

### 3.1 Conectar GitHub ao Vercel
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Selecione seu repositório `kanflow`
5. Clique em "Import"

### 3.2 Configurar Variáveis de Ambiente
No painel do Vercel, vá para **Settings → Environment Variables** e adicione:

```
DATABASE_URL=sua_url_do_banco_de_dados
JWT_SECRET=gere_uma_chave_aleatoria_forte
VITE_APP_ID=seu_app_id_do_manus
VITE_APP_TITLE=KanFlow CRM
VITE_APP_LOGO=https://seu-dominio.com/logo.png
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://seu-dominio.com/oauth
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_manus_id
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_api
```

### 3.3 Configurar Build
1. **Framework Preset**: Vite
2. **Build Command**: `pnpm build`
3. **Output Directory**: `dist`
4. **Install Command**: `pnpm install`

## Passo 4: Deploy

### 4.1 Primeiro Deploy
```bash
# Fazer push para GitHub
git push origin main

# Vercel detectará automaticamente e fará o deploy
```

### 4.2 Monitorar Deploy
1. Vá para https://vercel.com/dashboard
2. Selecione seu projeto `kanflow`
3. Acompanhe o build em tempo real
4. Após conclusão, seu site estará em: `kanflow.vercel.app`

## Passo 5: Configurar Domínio Customizado

### 5.1 Adicionar Domínio
1. No painel do Vercel, vá para **Settings → Domains**
2. Clique em "Add Domain"
3. Digite seu domínio (ex: kanflow.com)
4. Siga as instruções para configurar DNS

### 5.2 Configurar SSL
- Vercel configura SSL automaticamente com Let's Encrypt

## Passo 6: Configurar Manus OAuth

### 6.1 Adicionar Redirect URIs
No painel do Manus, adicione:
- `https://kanflow.vercel.app/api/oauth/callback`
- `https://seu-dominio.com/api/oauth/callback`

### 6.2 Atualizar Variáveis
```
VITE_OAUTH_PORTAL_URL=https://seu-dominio.com
```

## Passo 7: Executar Migrações

### 7.1 Após o primeiro deploy
```bash
# Conectar ao banco de produção
DATABASE_URL=sua_url_do_banco pnpm db:push

# Ou executar manualmente via Vercel CLI
vercel env pull
pnpm db:push
```

## Troubleshooting

### Erro: "DATABASE_URL not found"
- Verifique se a variável foi adicionada no Vercel
- Redeploy após adicionar: `git commit --allow-empty -m "redeploy" && git push`

### Erro: "Build failed"
- Verifique os logs no Vercel
- Certifique-se que `pnpm build` funciona localmente
- Verifique TypeScript errors: `pnpm tsc`

### Erro: "OAuth callback failed"
- Verifique se o Redirect URI está correto no Manus
- Certifique-se que `VITE_OAUTH_PORTAL_URL` está correto

### Aplicação lenta
- Verifique se o banco está respondendo
- Use `vercel logs` para ver erros
- Considere usar cache do Vercel

## Monitoramento

### Logs em Tempo Real
```bash
vercel logs kanflow --follow
```

### Métricas
- Acesse https://vercel.com/dashboard/analytics
- Monitore performance, erros e uptime

## Próximos Passos

1. ✅ Configurar domínio customizado
2. ✅ Configurar email (SendGrid, Mailgun)
3. ✅ Configurar backups do banco
4. ✅ Configurar monitoramento (Sentry, LogRocket)
5. ✅ Configurar CI/CD (GitHub Actions)

## Suporte

Para dúvidas:
- Documentação Vercel: https://vercel.com/docs
- Documentação Manus: https://docs.manus.im
- Suporte Vercel: https://vercel.com/support

