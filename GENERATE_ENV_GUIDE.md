# 🔧 Guia: Gerador Automático de Variáveis de Ambiente

Este guia explica como usar os scripts para gerar automaticamente todas as variáveis de ambiente necessárias para o KanFlow CRM.

---

## 📋 Opções Disponíveis

Você tem **3 opções** para gerar as variáveis:

### Opção 1: Python (Recomendado) ⭐
```bash
python3 scripts/generate-env.py
```

**Vantagens:**
- ✅ Funciona em qualquer sistema (Windows, Mac, Linux)
- ✅ Mais legível e fácil de manter
- ✅ Melhor tratamento de erros

### Opção 2: Node.js
```bash
node scripts/generate-env.mjs
```

**Vantagens:**
- ✅ Usa apenas JavaScript/Node.js
- ✅ Sem dependências externas
- ✅ Rápido

### Opção 3: Bash (Linux/Mac)
```bash
bash scripts/generate-env.sh
```

**Vantagens:**
- ✅ Nativo em Linux/Mac
- ✅ Sem dependências
- ✅ Simples e direto

---

## 🚀 Passo a Passo

### 1. Execute o Script

Escolha uma das opções acima e execute:

```bash
# Python (recomendado)
python3 scripts/generate-env.py

# ou Node.js
node scripts/generate-env.mjs

# ou Bash
bash scripts/generate-env.sh
```

### 2. Arquivos Gerados

O script criará **3 arquivos**:

| Arquivo | Uso | Descrição |
|---------|-----|-----------|
| `.env.local` | Desenvolvimento local | Arquivo com todas as variáveis para usar localmente |
| `.env.vercel` | Deploy Vercel | Formato texto para copiar/colar no Vercel |
| `.vercel-env.json` | Referência | Formato JSON para referência |

### 3. Atualize os Valores

Abra o arquivo `.env.local` e atualize com seus valores reais:

```bash
# Abrir arquivo
nano .env.local
# ou
code .env.local
```

**Variáveis que PRECISAM ser atualizadas:**

```env
# 1. Banco de Dados (OBRIGATÓRIO)
DATABASE_URL=mysql://seu_usuario:sua_senha@seu_host:3306/kanflow

# 2. Manus OAuth (OBRIGATÓRIO)
VITE_APP_ID=seu_app_id_do_manus

# 3. Forge API (OBRIGATÓRIO)
BUILT_IN_FORGE_API_KEY=sua_chave_api_do_manus

# 4. Owner Info (OPCIONAL)
OWNER_OPEN_ID=seu_id_do_manus
OWNER_NAME=Seu Nome
```

### 4. Testar Localmente

```bash
# Copiar para desenvolvimento local
cp .env.local .env.development.local

# Iniciar o servidor
pnpm dev
```

### 5. Deploy no Vercel

#### Opção A: Copiar/Colar Manual

1. Abra https://vercel.com/dashboard
2. Selecione seu projeto `kanflow-crm`
3. Vá para **Settings → Environment Variables**
4. Abra o arquivo `.env.vercel`
5. Copie cada linha e adicione no Vercel:
   - **Name**: (antes do `=`)
   - **Value**: (depois do `=`)

#### Opção B: Usar Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Puxar variáveis do Vercel
vercel env pull .env.local

# Ou fazer push das variáveis
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... etc
```

#### Opção C: Importar JSON (Futuro)

Se o Vercel suportar, você pode usar `.vercel-env.json` para importação em massa.

---

## 🔐 Segurança

### ⚠️ IMPORTANTE: Nunca Commite Arquivos .env

Adicione ao `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.vercel
.vercel-env.json
```

### ✅ Já está no .gitignore?

Verifique:
```bash
cat .gitignore | grep env
```

---

## 📊 Variáveis Explicadas

### Database
```env
DATABASE_URL=mysql://user:password@host:3306/kanflow
```
- **user**: Seu usuário MySQL
- **password**: Sua senha MySQL
- **host**: Seu servidor MySQL (localhost, supabase.com, etc)
- **kanflow**: Nome do banco de dados

### JWT Secret
```env
JWT_SECRET=<gerado automaticamente>
```
- Chave para assinar tokens JWT
- **Gerada automaticamente** com 32 caracteres aleatórios
- Nunca compartilhe!

### Manus OAuth
```env
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```
- Credenciais do seu aplicativo Manus
- Obtém em https://manus.im/dashboard

### Forge API
```env
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave
```
- Chave para usar APIs do Manus
- Obtém em https://manus.im/dashboard

---

## 🐛 Troubleshooting

### Erro: "Python not found"
```bash
# Tente python ao invés de python3
python scripts/generate-env.py

# Ou instale Python: https://python.org
```

### Erro: "Node not found"
```bash
# Instale Node.js: https://nodejs.org
# Ou use Python/Bash ao invés
```

### Erro: "Permission denied"
```bash
# Dê permissão de execução
chmod +x scripts/generate-env.sh
chmod +x scripts/generate-env.mjs
chmod +x scripts/generate-env.py

# Depois execute novamente
bash scripts/generate-env.sh
```

### Arquivo .env.local não criado
```bash
# Verifique permissões
ls -la scripts/

# Verifique se o diretório existe
mkdir -p scripts

# Execute novamente
python3 scripts/generate-env.py
```

---

## ✅ Checklist Pré-Deploy

Antes de fazer deploy no Vercel:

- [ ] Executou o script de geração
- [ ] Atualizou DATABASE_URL com seu banco real
- [ ] Atualizou VITE_APP_ID com seu App ID do Manus
- [ ] Atualizou BUILT_IN_FORGE_API_KEY com sua chave
- [ ] Testou localmente com `pnpm dev`
- [ ] Verificou que não há erros de TypeScript
- [ ] Adicionou variáveis no Vercel
- [ ] Fez deploy no Vercel
- [ ] Testou o app em produção

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do script
2. Verifique se os valores estão corretos
3. Teste localmente primeiro
4. Verifique os logs do Vercel
5. Abra uma issue no GitHub

---

## 🎯 Próximos Passos

Após gerar as variáveis:

1. ✅ Atualizar valores reais
2. ✅ Testar localmente
3. ✅ Fazer deploy no Vercel
4. ✅ Configurar domínio customizado
5. ✅ Configurar SSL (automático)

---

**Pronto! Agora você pode fazer deploy no Vercel com confiança! 🚀**

