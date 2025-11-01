# Deployment no Vercel

Este documento descreve como fazer o deploy da aplicação KanFlow CRM no Vercel.

## Pré-requisitos

1. **Conta no Vercel**: https://vercel.com
2. **GitHub conectado**: O repositório deve estar no GitHub
3. **Variáveis de Ambiente**: Todas as variáveis devem estar configuradas

## Configuração Automática

O arquivo `vercel.json` já está configurado com:

- **Node.js 22.x**: Runtime otimizado para ES modules
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Todas as variáveis necessárias

## Passos para Deploy

### 1. Push para GitHub

```bash
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

### 2. Conectar no Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `kanflow-crm`
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

Na página de configuração do Vercel, adicione as seguintes variáveis:

```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=seu_jwt_secret_aqui
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=Seu Nome
VITE_APP_TITLE=KanFlow CRM
VITE_APP_LOGO=https://seu-logo-url
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
```

### 4. Deploy

Clique em "Deploy" e aguarde o build completar.

## Resolução de Problemas

### Erro: "Cannot find module '@shared/const'"

Este erro foi resolvido com o script `fix-vercel-imports.mjs` que:
1. Resolve aliases `@shared/` para caminhos relativos
2. Adiciona extensões `.js` automaticamente
3. Executa durante o build

### Erro: "Module not found"

Se receber este erro:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Verifique se o banco de dados está acessível
3. Verifique os logs do Vercel para mais detalhes

### Verificar Logs

```bash
vercel logs --follow
```

## Estrutura do Build

O build cria a seguinte estrutura em `dist/`:

```
dist/
├── index.js                 # Entry point
├── _core/
│   ├── index.js
│   ├── oauth.js
│   ├── context.js
│   └── ...
├── routers/
│   ├── admin.js
│   ├── notifications.js
│   └── ...
├── shared/                  # Copiado do projeto
│   └── const.js
├── drizzle/                 # Copiado do projeto
│   └── schema.ts
└── public/                  # Arquivos estáticos
```

## Monitoramento

Após o deploy, monitore:

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Logs**: `vercel logs`
3. **Métricas**: Performance, uptime, etc.

## Rollback

Para voltar a uma versão anterior:

1. Acesse o Vercel Dashboard
2. Vá para "Deployments"
3. Encontre o deployment anterior
4. Clique em "Redeploy"

## Domínio Customizado

Para usar um domínio customizado:

1. Vá para "Settings" → "Domains"
2. Adicione seu domínio
3. Siga as instruções de DNS

## Suporte

Para mais informações, consulte:
- https://vercel.com/docs
- https://vercel.com/docs/nodejs/nodejs-runtime

