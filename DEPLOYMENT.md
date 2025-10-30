# 🚀 Guia de Deployment - KanFlow CRM

## Visão Geral

O **KanFlow CRM** está configurado para deployment automático no **GitHub Pages** usando **GitHub Actions**. Este guia descreve como funciona o processo de deployment, como fazer alterações e como configurar um domínio customizado.

---

## 📋 Arquitetura de Deployment

### Componentes Principais

| Componente | Função | Status |
|-----------|--------|--------|
| **GitHub Repository** | Controle de versão e código-fonte | ✅ Ativo |
| **GitHub Actions** | CI/CD automático | ✅ Ativo |
| **GitHub Pages** | Hospedagem estática | ✅ Ativo |
| **Vite** | Build tool para React | ✅ Configurado |
| **dist/public/** | Arquivos compilados para produção | ✅ Pronto |

### Fluxo de Deployment

```
1. Developer faz push para branch main
   ↓
2. GitHub Actions dispara workflow "Deploy to GitHub Pages"
   ↓
3. Instala dependências (pnpm install)
   ↓
4. Executa build (pnpm build)
   ↓
5. Publica dist/public/ no GitHub Pages
   ↓
6. Aplicação fica disponível em produção
```

---

## 🔄 Processo de Deployment Automático

### Como Funciona

Toda vez que você faz um push para a branch `main`, o GitHub Actions:

1. **Checkout** - Clona o repositório
2. **Setup** - Configura Node.js 22 e pnpm
3. **Install** - Instala dependências com `pnpm install`
4. **Build** - Compila a aplicação com `pnpm build`
5. **Deploy** - Publica em GitHub Pages

### Arquivo de Workflow

O arquivo `.github/workflows/deploy.yml` controla todo o processo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v2
      - run: pnpm install --no-frozen-lockfile
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

---

## 📊 URLs de Deployment

### Ambiente de Produção

**GitHub Pages (Padrão):**
```
https://saedadigital-ctrl.github.io/kanflow-crm/
```

**Domínio Customizado (Configurável):**
```
https://kanflow.saedadigital.com.br/
```

---

## 🛠️ Como Fazer Deploy

### Método 1: Deploy Automático (Recomendado)

1. Faça alterações no código localmente
2. Commit e push para `main`:
   ```bash
   git add .
   git commit -m "feat: sua mensagem"
   git push origin main
   ```
3. GitHub Actions fará o deploy automaticamente
4. Verifique o status em: https://github.com/saedadigital-ctrl/kanflow-crm/actions

### Método 2: Deploy Manual

Se precisar fazer deploy sem esperar o workflow:

1. Build localmente:
   ```bash
   pnpm build
   ```

2. Verifique se `dist/public/` foi criado:
   ```bash
   ls -la dist/public/
   ```

3. Commit e push:
   ```bash
   git add dist/
   git commit -m "build: atualizar arquivos compilados"
   git push origin main
   ```

---

## 🔍 Monitorar Deployment

### Ver Status do Build

1. Acesse: https://github.com/saedadigital-ctrl/kanflow-crm/actions
2. Clique no workflow mais recente
3. Verifique os logs de cada etapa

### Logs Disponíveis

- **Checkout** - Download do código
- **Setup** - Configuração do ambiente
- **Install** - Instalação de dependências
- **Build** - Compilação da aplicação
- **Deploy** - Upload para GitHub Pages

### Troubleshooting

Se o build falhar:

1. Verifique os logs no Actions
2. Procure por mensagens de erro
3. Corrija o código localmente
4. Faça novo push para triggerar rebuild

---

## 🌐 Configurar Domínio Customizado

### Pré-requisitos

- Domínio registrado (ex: kanflow.saedadigital.com.br)
- Acesso às configurações DNS do domínio

### Passos para Configurar

#### 1. Adicionar Arquivo CNAME

Crie o arquivo `public/CNAME` com seu domínio:

```
kanflow.saedadigital.com.br
```

Commit e push:
```bash
git add public/CNAME
git commit -m "chore: adicionar CNAME para domínio customizado"
git push origin main
```

#### 2. Configurar DNS

No seu provedor de DNS (ex: Namecheap, GoDaddy, etc):

**Opção A - CNAME (Recomendado):**
```
Host: kanflow
Type: CNAME
Value: saedadigital-ctrl.github.io
TTL: 3600
```

**Opção B - A Record:**
```
Host: kanflow
Type: A
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
TTL: 3600
```

#### 3. Verificar Configuração

Aguarde 5-10 minutos para DNS propagar:

```bash
# Testar CNAME
nslookup kanflow.saedadigital.com.br

# Testar acesso
curl -I https://kanflow.saedadigital.com.br
```

#### 4. Habilitar HTTPS

No GitHub:
1. Vá para Settings → Pages
2. Marque "Enforce HTTPS"
3. Aguarde certificado ser gerado (5-10 minutos)

---

## 📦 Variáveis de Ambiente

### Em Produção

As variáveis de ambiente são injetadas automaticamente pelo Manus:

```
VITE_APP_TITLE=KanFlow - CRM WhatsApp
VITE_APP_LOGO=https://seu-dominio.com/logo.svg
VITE_ANALYTICS_ENDPOINT=https://analytics.exemplo.com
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

### Adicionar Novas Variáveis

1. Edite `.env.example` com as novas variáveis
2. Commit e push
3. Atualize no Management UI → Settings → Secrets

---

## 🔒 Segurança em Produção

### Checklist de Segurança

- [x] HTTPS habilitado
- [x] GitHub Pages com proteção
- [x] Repositório privado (se necessário)
- [x] Secrets não expostos no código
- [x] Build reproducível
- [x] Logs auditáveis

### Proteção de Branch

Recomenda-se proteger a branch `main`:

1. Vá para Settings → Branches
2. Clique em "Add rule"
3. Configure:
   - Branch name pattern: `main`
   - Require pull request reviews
   - Require status checks to pass

---

## 📈 Performance e Otimizações

### Tamanho do Build

```
dist/public/
├── index.html          (5 KB)
├── assets/
│   ├── index-*.js      (250 KB - minificado)
│   ├── index-*.css     (50 KB - minificado)
│   └── ...
└── favicon.ico
```

### Otimizações Implementadas

- ✅ Minificação de JavaScript e CSS
- ✅ Tree-shaking de dependências não usadas
- ✅ Code splitting automático
- ✅ Compressão de assets
- ✅ Cache busting com hash de arquivo

### Melhorias Futuras

- [ ] Implementar service worker para offline
- [ ] Adicionar lazy loading de componentes
- [ ] Otimizar imagens com WebP
- [ ] Implementar CDN global

---

## 🔄 Rollback e Recuperação

### Se Algo Der Errado

#### Opção 1: Revert Rápido

```bash
# Ver histórico
git log --oneline

# Voltar para commit anterior
git revert <commit-hash>
git push origin main
```

#### Opção 2: Usar GitHub Releases

1. Vá para Releases no GitHub
2. Selecione versão anterior
3. Download e teste localmente
4. Se OK, faça novo push

#### Opção 3: Desabilitar Workflow

Se o workflow está causando problemas:

1. Vá para `.github/workflows/deploy.yml`
2. Renomeie para `deploy.yml.bak`
3. Commit e push
4. Workflow será desabilitado

---

## 📚 Recursos Úteis

### Documentação Oficial

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### Ferramentas de Monitoramento

- GitHub Actions Dashboard
- GitHub Pages Status
- Uptime Robot (para monitoramento externo)
- Google Analytics (para métricas de usuário)

---

## 🆘 Suporte e Troubleshooting

### Problemas Comuns

**P: O build falha com erro de dependências**
R: Execute `pnpm install --no-frozen-lockfile` localmente e commit o `pnpm-lock.yaml`

**P: Domínio customizado não funciona**
R: Verifique DNS com `nslookup` e aguarde propagação (até 48h)

**P: HTTPS não está habilitado**
R: Aguarde 10-15 minutos após configurar domínio, GitHub gera certificado automaticamente

**P: Aplicação não carrega após deploy**
R: Verifique logs em GitHub Actions → Actions → Deploy workflow

### Contato para Suporte

- Email: suporte@aedadigital.com.br
- GitHub Issues: https://github.com/saedadigital-ctrl/kanflow-crm/issues

---

## 📝 Changelog de Deployment

### v1.0.0 - 30 de Outubro de 2025

- ✅ Deploy inicial no GitHub Pages
- ✅ GitHub Actions workflow configurado
- ✅ Build automático implementado
- ✅ Documentação de deployment criada

---

**Última atualização:** 30 de Outubro de 2025  
**Status:** ✅ Produção  
**Próxima revisão:** Conforme necessário

