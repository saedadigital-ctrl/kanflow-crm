# 🔒 Documentação de Segurança - KanFlow CRM

## Visão Geral

Este documento descreve as medidas de segurança implementadas no KanFlow CRM para proteger dados de clientes, garantir conformidade com LGPD e prevenir ataques.

---

## 🛡️ Camadas de Segurança

### 1. **Autenticação e Autorização**

#### Autenticação
- **Manus Auth** - Sistema OAuth2 seguro
- **Tokens JWT** - Sessões criptografadas
- **Refresh Tokens** - Renovação automática de sessão
- **2FA (Planejado)** - Autenticação de dois fatores

#### Autorização
- **RBAC (Role-Based Access Control)**
  - `admin` - Acesso total ao sistema
  - `user` - Acesso limitado à sua organização
- **Multi-tenant Isolation** - Dados isolados por organização
- **Middleware de validação** - Verifica permissões em cada requisição

```typescript
// Exemplo de uso
validateOrganizationAccess(req, res, next);
```

---

### 2. **Criptografia de Dados**

#### Em Trânsito
- **HTTPS/TLS 1.3** - Todas as comunicações criptografadas
- **Certificate Pinning** - Previne ataques man-in-the-middle

#### Em Repouso
- **AES-256-GCM** - Criptografia de dados sensíveis
- **Bcrypt** - Hash de senhas (quando aplicável)
- **Encrypted Database Fields** - Campos sensíveis criptografados

```typescript
// Exemplo de uso
const encrypted = Encryption.encrypt("dados sensíveis");
const decrypted = Encryption.decrypt(encrypted);
```

#### Dados Criptografados
- Tokens de acesso WhatsApp
- Informações de pagamento
- Dados pessoais sensíveis (LGPD)

---

### 3. **Proteção contra Ataques**

#### Rate Limiting
- **Geral**: 100 req/15min por IP
- **Login**: 5 tentativas/15min
- **WhatsApp API**: 30 msg/min

```typescript
// Aplicado automaticamente
app.use(generalLimiter);
app.use('/auth', authLimiter);
app.use('/api/whatsapp', whatsappLimiter);
```

#### Proteção XSS (Cross-Site Scripting)
- **Sanitização automática** de todos os inputs
- **Content Security Policy (CSP)** via Helmet
- **Escape de HTML** em outputs

#### Proteção SQL Injection
- **Prepared Statements** via Drizzle ORM
- **Validação de tipos** TypeScript
- **Sanitização de queries**

#### Proteção CSRF (Cross-Site Request Forgery)
- **Tokens CSRF** em requisições de modificação
- **SameSite Cookies**
- **Origin Validation**

#### Proteção DDoS
- **Rate Limiting** por IP
- **Cloudflare** (recomendado para produção)
- **Auto-scaling** de infraestrutura

---

### 4. **Headers de Segurança (Helmet)**

```typescript
// Configuração automática
app.use(securityHeaders);
```

Headers aplicados:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`

---

### 5. **Auditoria e Logs**

#### Sistema de Auditoria
Todos os eventos importantes são registrados:

**Eventos Auditados:**
- ✅ Login/Logout (sucesso e falha)
- ✅ Alterações de senha
- ✅ Criação/edição/exclusão de usuários
- ✅ Mudanças em organizações
- ✅ Conexão/desconexão WhatsApp
- ✅ Envio de mensagens
- ✅ Exportação de dados (LGPD)
- ✅ Exclusão de dados (LGPD)
- ✅ Tentativas de acesso não autorizado
- ✅ Atividades suspeitas

```typescript
// Exemplo de uso
await AuditService.log({
  eventType: AuditEventType.LOGIN_SUCCESS,
  severity: AuditSeverity.INFO,
  userId: user.id,
  ipAddress: req.ip,
  userAgent: req.get('user-agent'),
});
```

#### Retenção de Logs
- **Logs de segurança**: 1 ano
- **Logs de auditoria**: 5 anos (compliance LGPD)
- **Logs de aplicação**: 90 dias

---

### 6. **Validação e Sanitização**

#### Validação de Inputs
- **Zod Schemas** - Validação de tipos
- **Regex Patterns** - Validação de formatos
- **Business Rules** - Validação de regras de negócio

#### Sanitização Automática
```typescript
// Aplicado automaticamente em todas as rotas
app.use(sanitizeMiddleware);
```

Remove:
- Tags HTML (`<script>`, `<iframe>`, etc.)
- Event handlers (`onclick`, `onerror`, etc.)
- JavaScript URIs (`javascript:`, `data:`, etc.)

#### Validação de Uploads
- **Tipos permitidos**: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX
- **Tamanho máximo**: 10MB
- **Scan de malware** (recomendado para produção)

---

### 7. **Conformidade LGPD**

#### Direitos dos Titulares
- ✅ **Acesso** - Exportar todos os dados
- ✅ **Retificação** - Corrigir dados incorretos
- ✅ **Exclusão** - Direito ao esquecimento
- ✅ **Portabilidade** - Exportar em formato legível
- ✅ **Revogação de consentimento**

#### Consentimento
- Modal de consentimento no primeiro acesso
- Aceite explícito dos Termos de Uso e Política de Privacidade
- Registro de consentimento com timestamp

#### Minimização de Dados
- Coleta apenas dados necessários
- Retenção limitada no tempo
- Anonimização quando possível

#### Segurança por Design
- Criptografia de dados sensíveis
- Isolamento multi-tenant
- Auditoria completa de acessos

---

## 🔐 Variáveis de Ambiente Sensíveis

```bash
# Criptografia
ENCRYPTION_KEY=<64 caracteres hex> # openssl rand -hex 32

# JWT
JWT_SECRET=<string aleatória segura>

# Database
DATABASE_URL=<connection string criptografada>

# WhatsApp API
WHATSAPP_API_KEY=<token seguro>

# Stripe
STRIPE_SECRET_KEY=<sk_live_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>
```

**⚠️ NUNCA commitar essas variáveis no git!**

---

## 🚨 Resposta a Incidentes

### Procedimento em Caso de Breach

1. **Detecção**
   - Monitoramento de logs de segurança
   - Alertas automáticos de atividades suspeitas

2. **Contenção**
   - Isolar sistemas afetados
   - Revogar tokens comprometidos
   - Bloquear IPs maliciosos

3. **Investigação**
   - Analisar logs de auditoria
   - Identificar escopo do incidente
   - Documentar evidências

4. **Notificação**
   - Notificar clientes afetados (LGPD)
   - Reportar à ANPD se necessário
   - Comunicar autoridades competentes

5. **Recuperação**
   - Restaurar de backups
   - Aplicar patches de segurança
   - Reforçar controles

6. **Pós-Incidente**
   - Análise de causa raiz
   - Atualizar procedimentos
   - Treinamento da equipe

---

## 📋 Checklist de Segurança

### Desenvolvimento
- [ ] Nunca commitar secrets no código
- [ ] Usar variáveis de ambiente
- [ ] Validar todos os inputs
- [ ] Sanitizar outputs
- [ ] Testar autenticação/autorização
- [ ] Code review focado em segurança

### Deploy
- [ ] HTTPS configurado
- [ ] Firewall configurado
- [ ] Rate limiting ativo
- [ ] Logs de auditoria funcionando
- [ ] Backups automáticos
- [ ] Monitoramento ativo

### Operação
- [ ] Revisar logs semanalmente
- [ ] Atualizar dependências mensalmente
- [ ] Testar backups mensalmente
- [ ] Auditar acessos trimestralmente
- [ ] Penetration testing anualmente

---

## 🔧 Ferramentas Recomendadas

### Desenvolvimento
- **Snyk** - Scan de vulnerabilidades em dependências
- **SonarQube** - Análise de código
- **GitGuardian** - Detecção de secrets no git

### Produção
- **Sentry** - Error tracking e monitoring
- **Cloudflare** - WAF e DDoS protection
- **AWS GuardDuty** - Threat detection
- **PagerDuty** - Alertas de incidentes

---

## 📞 Contatos de Segurança

**Security Team:**
- Email: security@kanflow.com.br
- PGP Key: [link]

**Responsible Disclosure:**
Se você encontrou uma vulnerabilidade, por favor reporte de forma responsável através de security@kanflow.com.br. Não divulgue publicamente antes de recebermos e corrigirmos o problema.

**Bug Bounty Program:**
Em breve teremos um programa de recompensas por bugs de segurança.

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LGPD - Lei Geral de Proteção de Dados](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [CIS Controls](https://www.cisecurity.org/controls)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Última atualização:** 2025-01-18  
**Versão:** 1.0  
**Responsável:** Security Team

