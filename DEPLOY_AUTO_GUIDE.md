# 🚀 Guia: Deploy Automático no Vercel

Este guia explica como usar os scripts de deploy automático para enviar seu KanFlow CRM para produção no Vercel.

---

## 📋 Opções Disponíveis

Você tem **2 opções** para fazer deploy automático:

### Opção 1: Python (Recomendado) ⭐
```bash
python3 scripts/deploy-vercel.py
```

### Opção 2: Node.js
```bash
node scripts/deploy-vercel.mjs
```

---

## 🚀 Passo a Passo

### 1. Pré-requisitos

Antes de fazer deploy, certifique-se de que:

- ✅ Você tem conta no Vercel (https://vercel.com)
- ✅ Você tem conta no GitHub (https://github.com)
- ✅ Você tem Vercel CLI instalado
- ✅ Você fez login no Vercel CLI
- ✅ Seu projeto está linkado ao Vercel

### 2. Verificar Vercel CLI

```bash
# Verificar se está instalado
vercel --version

# Se não estiver, instale:
npm install -g vercel

# Fazer login
vercel login

# Linkar projeto (se ainda não estiver linkado)
vercel link
```

### 3. Gerar Variáveis de Ambiente

Antes de fazer deploy, gere as variáveis:

```bash
python3 scripts/generate-env.py
```

Atualize o arquivo `.env.local` com seus valores reais.

### 4. Executar Deploy Automático

```bash
# Python
python3 scripts/deploy-vercel.py

# ou Node.js
node scripts/deploy-vercel.mjs
```

### 5. O que o Script Faz

O script executa automaticamente:

1. ✅ Verifica se Vercel CLI está instalado
2. ✅ Faz build local do projeto
3. ✅ Faz commit das mudanças no Git
4. ✅ Faz push para GitHub
5. ✅ Faz deploy no Vercel
6. ✅ Exibe URL de produção

**Tempo estimado**: 5-10 minutos

---

## 📊 Monitorar Deploy

Após o deploy:

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto `kanflow-crm`
3. Veja o status do deployment
4. Acesse sua URL de produção

---

## 🔧 Troubleshooting

### Erro: "Vercel CLI not found"
```bash
# Instale Vercel CLI
npm install -g vercel

# Faça login
vercel login
```

### Erro: "Project not linked"
```bash
# Linke o projeto
vercel link

# Siga as instruções
```

### Erro: "Build failed"
```bash
# Verifique se o build funciona localmente
pnpm build

# Verifique erros de TypeScript
pnpm type-check

# Verifique variáveis de ambiente
cat .env.local
```

### Erro: "Git push failed"
```bash
# Verifique status do Git
git status

# Configure credenciais
git config user.email "seu@email.com"
git config user.name "Seu Nome"

# Tente novamente
git push origin main
```

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Teste o app em produção
2. ✅ Verifique se login funciona
3. ✅ Teste criar organização
4. ✅ Configure domínio customizado
5. ✅ Configure SSL (automático)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do Vercel: `vercel logs`
2. Verifique o console do navegador (F12)
3. Verifique o banco de dados
4. Abra uma issue no GitHub

---

## 🔄 Deploy Contínuo

Para fazer deploy automático sempre que você faz push para GitHub:

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá para Settings → Git
4. Ative "Deploy on push"

Agora, sempre que você fizer push para `main`, o Vercel fará deploy automaticamente!

---

**Pronto para deploy! 🚀**

Execute: `python3 scripts/deploy-vercel.py`

