# 🧪 Plano de Testes de Validação - KanFlow CRM Produção

**URL de Produção:** https://kanflow-crm2026.vercel.app

**Data de Início:** 2025-11-05
**Ambiente:** Produção (Vercel)
**Status:** Pronto para Testes

---

## 📋 Estrutura do Plano de Testes

Este plano contém **10 suítes de testes** com **50+ casos de teste** cobrindo:
- Funcionalidade básica
- Autenticação e segurança
- Performance e responsividade
- Compatibilidade de navegadores
- Tratamento de erros
- Acessibilidade

---

## 🎯 Teste 1: Carregamento da Página

**Objetivo:** Validar que a página carrega corretamente sem erros

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão de internet estável
- Cache do navegador limpo (opcional)

### Casos de Teste

#### TC-1.1: Carregamento Inicial
**Passos:**
1. Abrir URL: https://kanflow-crm2026.vercel.app
2. Aguardar carregamento completo (até 5 segundos)
3. Verificar que página está visível

**Resultado Esperado:**
- ✅ Página carrega sem erros
- ✅ Tempo de carregamento < 3 segundos
- ✅ Nenhuma tela em branco ou erro visível

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-1.2: Verificar Logo KanFlow
**Passos:**
1. Após carregamento, procurar pelo logo KanFlow
2. Verificar que logo é azul com fundo branco
3. Verificar que logo está visível e não cortado

**Resultado Esperado:**
- ✅ Logo KanFlow (azul) visível
- ✅ Logo não está cortado
- ✅ Logo tem tamanho apropriado

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-1.3: Verificar Título da Página
**Passos:**
1. Procurar pelo título "KanFlow - Fluxo Inteligente de Vendas"
2. Verificar que está visível na página
3. Verificar que está na aba do navegador

**Resultado Esperado:**
- ✅ Título visível na página
- ✅ Título na aba do navegador
- ✅ Texto está correto

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-1.4: Verificar Layout Básico
**Passos:**
1. Verificar que header está presente
2. Verificar que conteúdo principal está presente
3. Verificar que footer está presente
4. Verificar que layout não está quebrado

**Resultado Esperado:**
- ✅ Header visível
- ✅ Conteúdo principal visível
- ✅ Footer visível
- ✅ Sem elementos sobrepostos

**Critério de Sucesso:** PASSOU / FALHOU

---

## 🔍 Teste 2: Verificar Console do Navegador

**Objetivo:** Validar que não há erros de JavaScript ou CORS

### Pré-requisitos
- DevTools aberto (F12)
- Aba "Console" selecionada

### Casos de Teste

#### TC-2.1: Verificar Erros de CORS
**Passos:**
1. Abrir DevTools (F12)
2. Ir para aba "Console"
3. Procurar por mensagens com "CORS" ou "Access-Control"
4. Procurar por erros em vermelho

**Resultado Esperado:**
- ✅ Nenhum erro de CORS
- ✅ Nenhuma mensagem de "blocked by CORS policy"
- ✅ Logo carregou sem erro

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-2.2: Verificar Erros de JavaScript
**Passos:**
1. Na aba "Console", procurar por mensagens em vermelho
2. Procurar por "Uncaught Error" ou "Cannot read property"
3. Procurar por "Module not found"

**Resultado Esperado:**
- ✅ Nenhum erro de JavaScript
- ✅ Nenhuma exceção não tratada
- ✅ Nenhum módulo faltando

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-2.3: Verificar Warnings
**Passos:**
1. Na aba "Console", procurar por mensagens em amarelo
2. Verificar se são warnings críticos ou apenas informativos
3. Documentar qualquer warning encontrado

**Resultado Esperado:**
- ✅ Nenhum warning crítico
- ✅ Warnings informativos são aceitáveis
- ⚠️ Documentar qualquer warning encontrado

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-2.4: Verificar Aba Network
**Passos:**
1. Ir para aba "Network" no DevTools
2. Recarregar página (F5)
3. Procurar por requisições com status 404 ou 500
4. Verificar que requisições principais têm status 200

**Resultado Esperado:**
- ✅ Nenhum erro 404 ou 500
- ✅ HTML com status 200
- ✅ CSS com status 200
- ✅ JavaScript com status 200

**Critério de Sucesso:** PASSOU / FALHOU

---

## 🔐 Teste 3: Autenticação

**Objetivo:** Validar que login e logout funcionam corretamente

### Pré-requisitos
- Credenciais de teste disponíveis
- Acesso ao portal OAuth Manus

### Casos de Teste

#### TC-3.1: Verificar Botão de Login
**Passos:**
1. Procurar pelo botão "Entrar" ou "Login" na página
2. Verificar que botão está visível e clicável
3. Verificar que botão tem texto claro

**Resultado Esperado:**
- ✅ Botão de login visível
- ✅ Botão é clicável
- ✅ Texto é claro ("Entrar", "Login", etc)

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-3.2: Clicar em Login
**Passos:**
1. Clicar no botão de login
2. Aguardar redirecionamento
3. Verificar que é redirecionado para portal OAuth

**Resultado Esperado:**
- ✅ Redirecionamento ocorre
- ✅ URL muda para portal OAuth
- ✅ Página de login Manus carrega

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-3.3: Fazer Login
**Passos:**
1. Na página de login, inserir credenciais de teste
2. Clicar em "Login" ou "Entrar"
3. Aguardar autenticação
4. Verificar redirecionamento de volta para aplicação

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento de volta para aplicação
- ✅ Usuário autenticado (verificar no header/menu)

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-3.4: Verificar Sessão Autenticada
**Passos:**
1. Após login, verificar que usuário está autenticado
2. Procurar pelo nome do usuário no header ou menu
3. Procurar por botão de logout
4. Verificar que dashboard ou página protegida carrega

**Resultado Esperado:**
- ✅ Nome do usuário visível
- ✅ Botão de logout presente
- ✅ Conteúdo protegido acessível

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-3.5: Fazer Logout
**Passos:**
1. Clicar em botão de logout
2. Aguardar redirecionamento
3. Verificar que volta para página inicial
4. Verificar que não está mais autenticado

**Resultado Esperado:**
- ✅ Logout bem-sucedido
- ✅ Redirecionamento para página inicial
- ✅ Botão de login visível novamente
- ✅ Sessão encerrada

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-3.6: Verificar Cookies de Sessão
**Passos:**
1. Fazer login novamente
2. Abrir DevTools (F12)
3. Ir para "Application" > "Cookies"
4. Procurar por cookie de sessão
5. Verificar flags de segurança

**Resultado Esperado:**
- ✅ Cookie de sessão presente
- ✅ Cookie tem flag "Secure"
- ✅ Cookie tem flag "HttpOnly"
- ✅ Cookie tem flag "SameSite"

**Critério de Sucesso:** PASSOU / FALHOU

---

## 📊 Teste 4: Funcionalidades Principais

**Objetivo:** Validar que funcionalidades core funcionam corretamente

### Pré-requisitos
- Estar autenticado
- Ter acesso a dados de teste

### Casos de Teste

#### TC-4.1: Carregar Dashboard
**Passos:**
1. Após login, aguardar carregamento do dashboard
2. Verificar que dados estão sendo carregados
3. Procurar por gráficos, tabelas ou cards de dados
4. Verificar que não há erros de carregamento

**Resultado Esperado:**
- ✅ Dashboard carrega
- ✅ Dados visíveis
- ✅ Nenhum erro de carregamento
- ✅ Tempo < 2 segundos

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-4.2: Verificar Kanban
**Passos:**
1. Procurar pela seção de Kanban/Pipeline
2. Verificar que colunas estão visíveis
3. Procurar por cartões/deals
4. Verificar que podem ser arrastados (se aplicável)

**Resultado Esperado:**
- ✅ Kanban visível
- ✅ Colunas carregadas
- ✅ Cartões visíveis
- ✅ Interações funcionam

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-4.3: Verificar Contatos
**Passos:**
1. Procurar pela seção de Contatos
2. Verificar que lista de contatos carrega
3. Procurar por campos (nome, email, telefone)
4. Verificar que dados estão corretos

**Resultado Esperado:**
- ✅ Lista de contatos carrega
- ✅ Campos visíveis
- ✅ Dados corretos
- ✅ Sem erros

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-4.4: Testar Filtros
**Passos:**
1. Procurar por opções de filtro
2. Aplicar um filtro (ex: por status, data, etc)
3. Verificar que resultados são filtrados
4. Limpar filtro e verificar que volta ao normal

**Resultado Esperado:**
- ✅ Filtros funcionam
- ✅ Resultados são atualizados
- ✅ Filtro pode ser limpo
- ✅ Sem erros

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-4.5: Testar Busca
**Passos:**
1. Procurar pela barra de busca
2. Digitar um termo de busca
3. Verificar que resultados aparecem
4. Limpar busca e verificar que volta ao normal

**Resultado Esperado:**
- ✅ Busca funciona
- ✅ Resultados aparecem
- ✅ Busca pode ser limpa
- ✅ Sem erros

**Critério de Sucesso:** PASSOU / FALHOU

---

## ⚡ Teste 5: Performance

**Objetivo:** Validar que aplicação tem performance aceitável

### Pré-requisitos
- DevTools aberto
- Aba "Performance" ou "Lighthouse" disponível

### Casos de Teste

#### TC-5.1: Medir Tempo de Carregamento Inicial
**Passos:**
1. Abrir DevTools (F12)
2. Ir para aba "Network"
3. Limpar cache (Ctrl+Shift+Delete)
4. Recarregar página (F5)
5. Verificar tempo total de carregamento

**Resultado Esperado:**
- ✅ Tempo de carregamento < 3 segundos
- ✅ Documento HTML carrega primeiro
- ✅ Recursos críticos carregam rápido

**Critério de Sucesso:** PASSOU / FALHOU

**Tempo Medido:** _____ segundos

---

#### TC-5.2: Verificar Tamanho de Bundle
**Passos:**
1. Na aba "Network", procurar por arquivo JavaScript principal
2. Verificar tamanho do arquivo
3. Procurar por arquivo CSS principal
4. Verificar tamanho total

**Resultado Esperado:**
- ✅ Bundle JS < 500KB (comprimido)
- ✅ Bundle CSS < 100KB (comprimido)
- ✅ Total < 1MB

**Critério de Sucesso:** PASSOU / FALHOU

**Tamanho Medido:** _____ KB

---

#### TC-5.3: Medir Tempo de Resposta de API
**Passos:**
1. Na aba "Network", procurar por requisições para API
2. Verificar tempo de resposta (latência)
3. Procurar por requisições lentas (> 1 segundo)

**Resultado Esperado:**
- ✅ Requisições de API < 1 segundo
- ✅ Nenhuma requisição > 2 segundos
- ✅ Média < 500ms

**Critério de Sucesso:** PASSOU / FALHOU

**Tempo Médio:** _____ ms

---

#### TC-5.4: Usar Lighthouse
**Passos:**
1. Abrir DevTools (F12)
2. Ir para aba "Lighthouse"
3. Clicar em "Analyze page load"
4. Aguardar análise completar
5. Verificar scores

**Resultado Esperado:**
- ✅ Performance > 80
- ✅ Accessibility > 80
- ✅ Best Practices > 80
- ✅ SEO > 80

**Critério de Sucesso:** PASSOU / FALHOU

**Scores:**
- Performance: _____
- Accessibility: _____
- Best Practices: _____
- SEO: _____

---

## 📱 Teste 6: Responsividade

**Objetivo:** Validar que aplicação funciona em diferentes tamanhos de tela

### Pré-requisitos
- DevTools aberto
- Modo responsivo ativado

### Casos de Teste

#### TC-6.1: Desktop (1920x1080)
**Passos:**
1. Abrir DevTools (F12)
2. Clicar em ícone de dispositivo (Toggle device toolbar)
3. Selecionar "Desktop" ou desativar modo responsivo
4. Verificar layout em tela cheia

**Resultado Esperado:**
- ✅ Layout completo visível
- ✅ Sem scroll horizontal
- ✅ Todos os elementos acessíveis
- ✅ Sem elementos sobrepostos

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-6.2: Tablet (768x1024)
**Passos:**
1. No modo responsivo, selecionar "iPad" ou 768x1024
2. Verificar layout em tamanho tablet
3. Verificar navegação
4. Verificar se há scroll horizontal

**Resultado Esperado:**
- ✅ Layout adaptado para tablet
- ✅ Sem scroll horizontal
- ✅ Navegação funciona
- ✅ Texto legível

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-6.3: Mobile (375x667)
**Passos:**
1. No modo responsivo, selecionar "iPhone" ou 375x667
2. Verificar layout em tamanho mobile
3. Verificar navegação (menu hambúrguer, etc)
4. Verificar se tudo é acessível com scroll

**Resultado Esperado:**
- ✅ Layout otimizado para mobile
- ✅ Menu acessível (hambúrguer ou similar)
- ✅ Sem scroll horizontal
- ✅ Tudo acessível com scroll vertical

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-6.4: Orientação Landscape (Mobile)
**Passos:**
1. Em modo mobile, girar para landscape
2. Verificar layout em orientação horizontal
3. Verificar que conteúdo se adapta

**Resultado Esperado:**
- ✅ Layout se adapta
- ✅ Sem scroll horizontal
- ✅ Conteúdo legível

**Critério de Sucesso:** PASSOU / FALHOU

---

## 🔒 Teste 7: Segurança

**Objetivo:** Validar que aplicação tem segurança adequada

### Pré-requisitos
- Acesso a DevTools
- Conhecimento básico de segurança web

### Casos de Teste

#### TC-7.1: Verificar HTTPS
**Passos:**
1. Verificar URL: deve começar com "https://"
2. Clicar no ícone de cadeado na barra de endereços
3. Verificar que certificado é válido
4. Verificar que não há avisos de segurança

**Resultado Esperado:**
- ✅ URL começa com "https://"
- ✅ Certificado SSL válido
- ✅ Sem avisos de segurança
- ✅ Cadeado verde visível

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-7.2: Verificar Headers de Segurança
**Passos:**
1. Abrir DevTools (F12)
2. Ir para aba "Network"
3. Clicar na requisição HTML principal
4. Ir para aba "Headers"
5. Procurar por headers de segurança

**Resultado Esperado:**
- ✅ Content-Security-Policy presente
- ✅ X-Frame-Options presente
- ✅ X-Content-Type-Options presente
- ✅ Strict-Transport-Security presente

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-7.3: Verificar Cookies Seguros
**Passos:**
1. Abrir DevTools (F12)
2. Ir para "Application" > "Cookies"
3. Procurar por cookies de sessão
4. Verificar flags de cada cookie

**Resultado Esperado:**
- ✅ Cookies têm flag "Secure"
- ✅ Cookies têm flag "HttpOnly"
- ✅ Cookies têm flag "SameSite"
- ✅ Nenhum cookie com dados sensíveis

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-7.4: Verificar Dados no LocalStorage
**Passos:**
1. Abrir DevTools (F12)
2. Ir para "Application" > "Local Storage"
3. Procurar por dados armazenados
4. Verificar se há dados sensíveis

**Resultado Esperado:**
- ✅ Nenhuma senha armazenada
- ✅ Nenhum token de autenticação em plain text
- ✅ Nenhuma informação pessoal sensível

**Critério de Sucesso:** PASSOU / FALHOU

---

## 🌐 Teste 8: Compatibilidade de Navegadores

**Objetivo:** Validar que aplicação funciona em diferentes navegadores

### Pré-requisitos
- Acesso a múltiplos navegadores
- Credenciais de teste

### Casos de Teste

#### TC-8.1: Chrome/Chromium
**Passos:**
1. Abrir em Chrome ou Chromium
2. Fazer login
3. Testar funcionalidades principais
4. Verificar console para erros

**Resultado Esperado:**
- ✅ Funciona perfeitamente
- ✅ Nenhum erro de compatibilidade
- ✅ Performance aceitável

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-8.2: Firefox
**Passos:**
1. Abrir em Firefox
2. Fazer login
3. Testar funcionalidades principais
4. Verificar console para erros

**Resultado Esperado:**
- ✅ Funciona perfeitamente
- ✅ Nenhum erro de compatibilidade
- ✅ Performance aceitável

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-8.3: Safari
**Passos:**
1. Abrir em Safari (macOS ou iOS)
2. Fazer login
3. Testar funcionalidades principais
4. Verificar console para erros

**Resultado Esperado:**
- ✅ Funciona perfeitamente
- ✅ Nenhum erro de compatibilidade
- ✅ Performance aceitável

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-8.4: Edge
**Passos:**
1. Abrir em Microsoft Edge
2. Fazer login
3. Testar funcionalidades principais
4. Verificar console para erros

**Resultado Esperado:**
- ✅ Funciona perfeitamente
- ✅ Nenhum erro de compatibilidade
- ✅ Performance aceitável

**Critério de Sucesso:** PASSOU / FALHOU

---

## ⚠️ Teste 9: Tratamento de Erros

**Objetivo:** Validar que erros são tratados graciosamente

### Pré-requisitos
- Capacidade de simular erros
- Conexão de internet controlável

### Casos de Teste

#### TC-9.1: Erro de Rede (Offline)
**Passos:**
1. Abrir aplicação
2. Desconectar internet (modo avião)
3. Tentar fazer uma ação que requer rede
4. Verificar mensagem de erro

**Resultado Esperado:**
- ✅ Mensagem de erro clara
- ✅ Opção de retry
- ✅ Aplicação não trava
- ✅ Reconectar internet e retry funciona

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-9.2: Erro de Autenticação
**Passos:**
1. Fazer logout
2. Tentar acessar página protegida diretamente via URL
3. Verificar redirecionamento para login

**Resultado Esperado:**
- ✅ Redirecionamento para login
- ✅ Mensagem clara
- ✅ Sem exposição de dados

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-9.3: Erro de Validação (Formulário)
**Passos:**
1. Procurar por um formulário
2. Tentar enviar com dados inválidos
3. Verificar mensagens de erro

**Resultado Esperado:**
- ✅ Mensagens de erro claras
- ✅ Campos em erro destacados
- ✅ Instruções de correção

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-9.4: Erro 404 (Página não encontrada)
**Passos:**
1. Tentar acessar URL inexistente
2. Verificar página de erro 404

**Resultado Esperado:**
- ✅ Página 404 amigável
- ✅ Link para voltar à home
- ✅ Mensagem clara

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-9.5: Erro 500 (Servidor)
**Passos:**
1. Simular erro de servidor (se possível)
2. Verificar mensagem de erro

**Resultado Esperado:**
- ✅ Mensagem de erro clara
- ✅ Opção de retry
- ✅ Sem exposição de detalhes técnicos

**Critério de Sucesso:** PASSOU / FALHOU

---

## ♿ Teste 10: Acessibilidade (Opcional)

**Objetivo:** Validar que aplicação é acessível

### Pré-requisitos
- Conhecimento de acessibilidade web
- Ferramentas de teste de acessibilidade (opcional)

### Casos de Teste

#### TC-10.1: Navegação por Teclado
**Passos:**
1. Usar apenas teclado (sem mouse)
2. Navegar pela página usando Tab
3. Ativar elementos usando Enter
4. Usar Esc para fechar modais

**Resultado Esperado:**
- ✅ Todos os elementos são acessíveis
- ✅ Ordem de tabulação lógica
- ✅ Foco visível em todos os elementos
- ✅ Sem armadilhas de teclado

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-10.2: Contraste de Cores
**Passos:**
1. Verificar contraste entre texto e fundo
2. Procurar por texto muito claro ou muito escuro
3. Usar ferramenta como WebAIM Contrast Checker

**Resultado Esperado:**
- ✅ Contraste WCAG AA (4.5:1 para texto)
- ✅ Contraste WCAG AAA (7:1 para texto)
- ✅ Sem texto ilegível

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-10.3: Textos Alternativos
**Passos:**
1. Procurar por imagens na página
2. Verificar se têm atributo `alt`
3. Verificar se descrição é adequada

**Resultado Esperado:**
- ✅ Todas as imagens têm `alt`
- ✅ Descrições são úteis
- ✅ Logos têm descrição apropriada

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-10.4: Labels em Formulários
**Passos:**
1. Procurar por formulários
2. Verificar se campos têm labels
3. Verificar se labels estão associados (for/id)

**Resultado Esperado:**
- ✅ Todos os campos têm labels
- ✅ Labels estão associados
- ✅ Leitores de tela conseguem ler

**Critério de Sucesso:** PASSOU / FALHOU

---

#### TC-10.5: Lighthouse Accessibility Score
**Passos:**
1. Abrir DevTools (F12)
2. Ir para aba "Lighthouse"
3. Clicar em "Analyze page load"
4. Verificar score de Accessibility

**Resultado Esperado:**
- ✅ Score > 80
- ✅ Sem erros críticos
- ✅ Recomendações implementadas

**Critério de Sucesso:** PASSOU / FALHOU

**Score:** _____

---

## 📊 Resumo de Resultados

### Contagem de Testes

| Teste | Passou | Falhou | Total |
|-------|--------|--------|-------|
| 1. Carregamento | ___ | ___ | 4 |
| 2. Console | ___ | ___ | 4 |
| 3. Autenticação | ___ | ___ | 6 |
| 4. Funcionalidades | ___ | ___ | 5 |
| 5. Performance | ___ | ___ | 4 |
| 6. Responsividade | ___ | ___ | 4 |
| 7. Segurança | ___ | ___ | 4 |
| 8. Compatibilidade | ___ | ___ | 4 |
| 9. Tratamento de Erros | ___ | ___ | 5 |
| 10. Acessibilidade | ___ | ___ | 5 |
| **TOTAL** | **___** | **___** | **45** |

---

### Taxa de Sucesso

```
Taxa de Sucesso = (Testes Passando / Total de Testes) × 100

Taxa = ___% 

Critério de Aceitação: > 95%
```

---

## 🎯 Conclusões e Recomendações

### Problemas Encontrados

1. _________________________________
2. _________________________________
3. _________________________________

### Recomendações

1. _________________________________
2. _________________________________
3. _________________________________

### Próximos Passos

- [ ] Corrigir problemas críticos
- [ ] Implementar recomendações
- [ ] Fazer re-teste
- [ ] Documentar lições aprendidas
- [ ] Preparar para produção

---

## 📝 Assinatura do Testador

**Nome:** _____________________
**Data:** _____________________
**Resultado Final:** APROVADO / REPROVADO

---

## 📚 Referências

- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)
- [Documentação Vercel](https://vercel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última Atualização:** 2025-11-05
**Status:** Pronto para Execução

