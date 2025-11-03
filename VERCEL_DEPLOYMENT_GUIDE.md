# KanFlow CRM - Guia de Deployment no Vercel

## Status Atual

✅ **Código:** Pronto para deploy  
✅ **Repositório:** Sincronizado no GitHub (saedadigital-ctrl/kanflow-crm)  
✅ **Configuração:** vercel.json otimizado  
✅ **Build:** Testado e funcionando localmente  

## Passo a Passo para Deploy

### 1. Acessar Vercel

Abra este link no navegador:
```
https://vercel.com/new?repo=saedadigital-ctrl/kanflow-crm
```

### 2. Autorizar GitHub (se necessário)

Se o Vercel pedir para autorizar o GitHub:
- Clique em **"Continue with GitHub"**
- Autorize o Vercel a acessar seus repositórios
- Retorne à página anterior e tente novamente

### 3. Configurar Projeto

Na página de importação:

**a) Informações do Projeto:**
- Project Name: `kanflow-crm` (já preenchido)
- Framework: Deixe como "Other" (será detectado automaticamente)
- Root Directory: `.` (raiz do projeto)

**b) Build and Output Settings:**
- Build Command: `pnpm build`
- Output Directory: `dist/public`
- Install Command: `pnpm install`

**c) Environment Variables:**

Adicione as seguintes variáveis (clique em "Add More" para cada uma):

| Key | Value | Descrição |
|-----|-------|-----------|
| `DATABASE_URL` | Sua string de conexão MySQL/TiDB | Banco de dados |
| `JWT_SECRET` | Uma chave aleatória (ex: `your-secret-key-here`) | Segurança de sessão |
| `VITE_APP_ID` | Seu ID de aplicação Manus | OAuth |
| `OAUTH_SERVER_URL` | https://api.manus.im | Servidor OAuth |
| `VITE_OAUTH_PORTAL_URL` | https://portal.manus.im | Portal OAuth |
| `VITE_APP_TITLE` | KanFlow CRM | Título da aplicação |
| `VITE_APP_LOGO` | URL da logo | Logo da aplicação |
| `BUILT_IN_FORGE_API_URL` | URL da API Forge | API interna |
| `BUILT_IN_FORGE_API_KEY` | Sua chave de API | Chave de autenticação |

### 4. Deploy

Clique em **"Deploy"** e aguarde o build completar.

## Após o Deploy

### Verificar Status

1. Acesse o dashboard do Vercel
2. Procure pelo projeto "kanflow-crm"
3. Verifique se o deployment foi bem-sucedido (status verde)

### Acessar Aplicação

A aplicação estará disponível em:
```
https://kanflow-crm.vercel.app
```

### Testar Funcionalidades

1. **Login:** Acesse a página de login
2. **Dashboard:** Verifique as métricas
3. **Conversation Manager:** Teste o Kanban
4. **WhatsApp Integration:** Configure sua conta
5. **Admin Panel:** Gerencie clientes

## Troubleshooting

### Erro: "Cannot find module"

**Solução:** Verifique se o `vercel.json` tem a configuração correta de `outputDirectory`.

### Erro: "Build failed"

**Solução:** 
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o `DATABASE_URL` está correto
3. Verifique os logs de build no Vercel

### Erro: "Database connection failed"

**Solução:**
1. Verifique se o `DATABASE_URL` está correto
2. Certifique-se de que o banco de dados está acessível
3. Verifique as credenciais de conexão

## Variáveis de Ambiente - Onde Obter

### DATABASE_URL
- Se usar TiDB: Obtenha da console do TiDB Cloud
- Se usar MySQL: `mysql://user:password@host:port/database`

### JWT_SECRET
- Gere uma chave aleatória segura (mínimo 32 caracteres)
- Exemplo: `openssl rand -base64 32`

### VITE_APP_ID
- Obtenha do seu painel Manus
- Configurações → Aplicações → ID da Aplicação

### VITE_APP_TITLE
- Qualquer título para sua aplicação
- Exemplo: "KanFlow CRM"

### VITE_APP_LOGO
- URL pública de uma imagem (logo)
- Exemplo: `https://example.com/logo.png`

## Próximos Passos

1. ✅ Deploy no Vercel
2. Configure domínio customizado (opcional)
3. Configure SSL/TLS (automático no Vercel)
4. Configure webhooks do WhatsApp
5. Configure notificações por email
6. Monitore performance e logs

## Suporte

Se encontrar problemas:
1. Verifique os logs no dashboard do Vercel
2. Consulte a documentação do Vercel: https://vercel.com/docs
3. Verifique o repositório GitHub para atualizações

---

**Desenvolvido com ❤️ por Studio AEDA Digital**

