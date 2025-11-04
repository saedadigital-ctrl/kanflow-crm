# 📖 Guia Passo-a-Passo: Deploy no Manus com Clear Cache

## 🎯 Objetivo

Fazer deploy do KanFlow CRM com limpeza de cache para resolver o erro "checkpoint record not found".

---

## 📋 Pré-requisitos

✅ Mudanças já aplicadas:
- Package.json atualizado para versão `1.0.0+nocache1`
- Code splitting implementado
- Build testado localmente

---

## 🚀 Passo-a-Passo

### **PASSO 1: Abrir o Management UI do Manus**

1. **Localize o ícone de engrenagem** (⚙️) no canto superior direito da interface
2. **Clique no ícone** para abrir o Management UI (painel de controle)
3. Você verá um painel lateral com várias opções

**Resultado esperado:** Painel lateral aberto com abas: Preview, Code, Dashboard, Database, Settings

---

### **PASSO 2: Acessar Settings**

1. No painel lateral, localize a aba **"Settings"** (geralmente a última aba)
2. **Clique em "Settings"** para abrir o painel de configurações
3. Você verá várias sub-opções no lado esquerdo

**Resultado esperado:** Painel de Settings aberto com opções como General, Domains, Notifications, Secrets

---

### **PASSO 3: Encontrar Build/Deploy**

1. Procure por uma opção chamada **"Build"**, **"Deploy"**, **"Build/Deploy"** ou **"Cache"**
2. Se não encontrar, procure em:
   - **"General"** (pode estar lá)
   - **"Advanced"** (se existir)
   - Ou no topo do painel de Settings

3. **Clique na opção** quando encontrar

**Resultado esperado:** Painel de Build/Deploy aberto com opções de cache

---

### **PASSO 4: Limpar Cache**

1. Procure por um botão chamado:
   - **"Clear Cache"**
   - **"Clear Build Cache"**
   - **"Rebuild from Scratch"**
   - **"Reset Cache"**

2. **Clique no botão** para limpar o cache

3. Você pode ver uma confirmação:
   - ✅ "Cache cleared successfully"
   - ✅ "Build cache resetado"

**Resultado esperado:** Cache limpo com mensagem de confirmação

---

### **PASSO 5: Voltar para o Projeto**

1. Feche o painel de Settings ou clique em outra aba
2. Você deve voltar para a visualização principal do projeto
3. Procure por um botão **"Publish"** no topo direito da interface

**Resultado esperado:** Botão "Publish" visível e ativo

---

### **PASSO 6: Fazer Deploy (Publish)**

1. **Clique no botão "Publish"** (geralmente no topo direito)
2. Você pode ver uma caixa de diálogo com opções:
   - **"Deploy"** ou **"Publish"** (confirme)
   - Pode pedir comentário ou descrição (opcional)

3. **Confirme o deploy** clicando em "Publish" ou "Deploy"

**Resultado esperado:** Deploy iniciado com mensagem "Deploying..." ou "Building..."

---

### **PASSO 7: Aguardar Build Completo**

1. Você verá uma barra de progresso ou logs em tempo real
2. O build pode levar **2-5 minutos** (primeira vez sem cache)
3. Procure por mensagens como:
   - ✅ "Build successful"
   - ✅ "Deployment complete"
   - ✅ "Live at: https://..."

4. **Aguarde até ver a mensagem de sucesso**

**Resultado esperado:** Build completo sem erros, deploy bem-sucedido

---

### **PASSO 8: Validar Deploy**

1. Após sucesso, você verá um link para o site ao vivo
2. **Clique no link** ou acesse manualmente
3. Verifique se:
   - ✅ Página carrega normalmente
   - ✅ Sem erros de console
   - ✅ Lazy loading funciona (veja loading spinner ao navegar)

**Resultado esperado:** Site ao vivo funcionando normalmente

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────┐
│  Manus Management UI                    │
├─────────────────────────────────────────┤
│  [⚙️ Settings]  [Code]  [Dashboard]     │
│                                         │
│  Settings Panel:                        │
│  ├─ General                             │
│  ├─ Domains                             │
│  ├─ Build/Deploy  ← CLIQUE AQUI        │
│  ├─ Notifications                       │
│  └─ Secrets                             │
│                                         │
│  Build/Deploy Panel:                    │
│  ├─ [Clear Cache] ← CLIQUE AQUI        │
│  ├─ Build Status                        │
│  └─ Deploy History                      │
│                                         │
│  [Publish] ← CLIQUE AQUI DEPOIS        │
└─────────────────────────────────────────┘
```

---

## ⚠️ Se Algo Der Errado

### **Erro: "Publish button disabled"**
- Volte para Code panel
- Verifique se há mudanças não salvas
- Tente novamente

### **Erro: "Build failed"**
- Clique em "Clear Cache" novamente
- Tente fazer deploy sem cache uma segunda vez
- Verifique os logs de erro

### **Erro: "Checkpoint record not found"**
- Significa que o cache ainda está quebrado
- Repita o processo de Clear Cache
- Tente deploy novamente

### **Build muito lento (> 10 minutos)**
- Primeira build sem cache é normal (2-5 min)
- Se passar de 10 min, pode haver problema
- Cancele e tente novamente

---

## ✅ Checklist Final

- [ ] Abri o Management UI (ícone ⚙️)
- [ ] Acessei Settings
- [ ] Encontrei Build/Deploy
- [ ] Cliquei em "Clear Cache"
- [ ] Voltei para o projeto
- [ ] Cliquei em "Publish"
- [ ] Confirmei o deploy
- [ ] Aguardei build completo (2-5 min)
- [ ] Vi mensagem de sucesso
- [ ] Testei o site ao vivo

---

## 📞 Se Precisar de Ajuda

Se ficar preso em algum passo:
1. Tire uma screenshot da tela
2. Descreva qual passo está travado
3. Compartilhe a mensagem de erro (se houver)

---

**Versão:** 1.0.0
**Data:** 2025-01-03
**Status:** ✅ Pronto para Deploy

