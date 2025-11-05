# 🔗 Conectar GitHub ao Vercel - KanFlow CRM

## Status: Pronto para Conectar

Suas variáveis de ambiente foram configuradas com sucesso! Agora vamos conectar o repositório GitHub ao Vercel para deploy automático.

---

## Fase 3: Conectar Repositório GitHub

### Passo 1: Acessar Settings do Projeto Vercel
1. Ir para: https://vercel.com/dashboard
2. Selecionar projeto: **whatsapp-crm-kanban**
3. Clicar em **Settings** (engrenagem no topo direito)

### Passo 2: Ir para Git Integration
1. No menu lateral, clicar em **Git**
2. Ou acessar diretamente: https://vercel.com/[team]/whatsapp-crm-kanban/settings/git

### Passo 3: Conectar Repositório GitHub
1. Procurar pela seção **Connected Git Repository**
2. Clicar em **Connect Repository** (se ainda não conectado)
3. Selecionar **GitHub**
4. Autorizar Vercel a acessar sua conta GitHub
5. Selecionar repositório: `saedadigital-ctrl/kanflow-crm`

### Passo 4: Configurar Branch de Deploy
1. Na seção **Production Branch**, selecionar: `main`
2. Na seção **Preview Branches**, deixar como padrão (opcional)
3. Salvar configurações

---

## Fase 4: Fazer Deploy em Produção

Após conectar GitHub, você tem 2 opções:

### Opção A: Deploy Automático (Recomendado)
1. Fazer push para GitHub:
   ```bash
   git push github main
   ```
2. Vercel detectará automaticamente a mudança
3. Deploy iniciará automaticamente
4. Aguardar 2-5 minutos para conclusão

### Opção B: Deploy Manual
1. Ir para **Deployments** no dashboard Vercel
2. Clicar em **Redeploy** na última versão
3. Aguardar conclusão

---

## Monitorando o Deploy

### Verificar Status do Deploy
1. Ir para **Deployments** no dashboard Vercel
2. Clicar na última versão
3. Verificar status:
   - 🟡 Building: Está compilando
   - 🟢 Ready: Deploy completo
   - 🔴 Failed: Erro durante deploy

### Verificar Logs de Build
1. Clicar em **Logs** na página de deployment
2. Procurar por erros ou warnings
3. Comum ver:
   - ✅ "Build completed successfully"
   - ✅ "Deployment ready"

### Acessar Aplicação Deployada
- URL padrão: `https://whatsapp-crm-kanban.vercel.app`
- Ou domínio customizado (se configurado)

---

## Troubleshooting

### Erro: "Build failed"
**Solução:**
1. Verificar logs de build em Vercel
2. Confirmar que todas as variáveis de ambiente estão corretas
3. Testar build localmente: `pnpm build`
4. Verificar se há erros de TypeScript: `pnpm check`

### Erro: "Database connection failed"
**Solução:**
1. Confirmar DATABASE_URL está correto
2. Verificar que banco de dados permite conexões externas
3. Testar conexão localmente

### Erro: "Module not found"
**Solução:**
1. Confirmar que todas as dependências estão instaladas
2. Verificar se há conflitos de versão
3. Fazer rebuild: `pnpm install && pnpm build`

### Erro: "CORS error"
**Solução:**
1. ✅ Já resolvido - usando logo local `/kanflow-logo-solid.png`
2. Verificar console do navegador (F12)

---

## Fase 5: Validar Deploy

Após o deploy ser bem-sucedido, testar:

### 1. Acessar Aplicação
1. Ir para URL pública: `https://whatsapp-crm-kanban.vercel.app`
2. Confirmar que página carrega sem erros

### 2. Verificar Logo
1. Confirmar que logo KanFlow (azul) aparece
2. Abrir DevTools (F12)
3. Ir para `Console`
4. Confirmar que não há erros de CORS

### 3. Testar Autenticação
1. Clicar em "Entrar" ou "Login"
2. Confirmar que redirecionamento para OAuth funciona
3. Fazer login com conta de teste
4. Confirmar que dashboard carrega

### 4. Testar Funcionalidades
1. Verificar Dashboard
2. Verificar Pipeline Kanban
3. Verificar Contatos
4. Verificar se dados carregam corretamente

### 5. Verificar Logs
1. Abrir DevTools (F12)
2. Ir para `Console` e `Network`
3. Procurar por erros
4. Confirmar que requisições à API são bem-sucedidas

---

## Fase 6: Monitorar Logs e Performance

### Acessar Logs de Produção
1. Ir para **Deployments** > [latest] > **Logs**
2. Verificar logs de build e runtime
3. Procurar por erros ou warnings

### Monitorar Performance
1. Ir para **Analytics** no dashboard Vercel
2. Verificar:
   - Response time
   - Uptime
   - Error rate
   - Bandwidth usage

### Configurar Alertas (Opcional)
1. Ir para **Settings > Alerts**
2. Configurar notificações para:
   - Build failures
   - High error rates
   - Performance degradation

---

## Próximos Passos

### Imediato (Hoje)
- [ ] Conectar GitHub ao Vercel
- [ ] Fazer primeiro deploy
- [ ] Validar que aplicação funciona

### Curto Prazo (Esta Semana)
- [ ] Testar todas as funcionalidades em produção
- [ ] Configurar domínio customizado (opcional)
- [ ] Monitorar logs e performance

### Médio Prazo (Este Mês)
- [ ] Otimizar performance
- [ ] Configurar CI/CD avançado
- [ ] Implementar testes automáticos

### Longo Prazo (Contínuo)
- [ ] Monitorar uptime e performance
- [ ] Manter dependências atualizadas
- [ ] Implementar melhorias baseadas em feedback

---

## Checklist Final

- [ ] GitHub conectado ao Vercel
- [ ] Branch `main` configurado para deploy
- [ ] Primeiro deploy completado com sucesso
- [ ] Aplicação acessível em produção
- [ ] Logo carregando sem erros
- [ ] Autenticação funcionando
- [ ] Dashboard carregando dados
- [ ] Nenhum erro no console
- [ ] Performance aceitável
- [ ] Logs monitorados

---

## Suporte

Se encontrar problemas:
1. Verificar logs em Vercel
2. Testar localmente: `pnpm dev`
3. Verificar variáveis de ambiente
4. Consultar documentação Vercel: https://vercel.com/docs

---

## Próximo Passo

Após completar esta fase, você terá:
- ✅ Código sincronizado com GitHub
- ✅ Variáveis de ambiente configuradas
- ✅ GitHub conectado ao Vercel
- ✅ Aplicação deployada em produção
- ✅ Deploy automático funcionando

Informe-me quando terminar para prosseguir com validação e monitoramento!

