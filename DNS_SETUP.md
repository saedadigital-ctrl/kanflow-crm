# 🌐 Guia de Configuração DNS - KanFlow CRM

## Domínio Customizado

**Domínio Configurado:** `kanflow.saedadigital.com.br`

---

## 📋 Informações Necessárias

| Item | Valor |
|------|-------|
| **Domínio** | kanflow.saedadigital.com.br |
| **Tipo de Configuração** | CNAME (Recomendado) |
| **Alvo** | saedadigital-ctrl.github.io |
| **TTL** | 3600 (1 hora) |

---

## 🔧 Passo 1: Configurar DNS

### Se você usa Namecheap

1. Faça login em https://www.namecheap.com/
2. Vá para "Manage Domains"
3. Clique no seu domínio `saedadigital.com.br`
4. Clique em "Advanced DNS"
5. Adicione um novo registro:
   - **Type:** CNAME Record
   - **Host:** kanflow
   - **Value:** saedadigital-ctrl.github.io
   - **TTL:** 3600
6. Clique em "Save"

### Se você usa GoDaddy

1. Faça login em https://www.godaddy.com/
2. Vá para "My Products" → "Domains"
3. Clique no seu domínio
4. Vá para "DNS"
5. Clique em "Add"
6. Configure:
   - **Type:** CNAME
   - **Name:** kanflow
   - **Value:** saedadigital-ctrl.github.io
   - **TTL:** 3600
7. Clique em "Save"

### Se você usa outro provedor

Procure por "Add DNS Record" e configure:

```
Type:   CNAME
Host:   kanflow
Value:  saedadigital-ctrl.github.io
TTL:    3600
```

---

## ✅ Passo 2: Verificar Configuração

Aguarde 5-10 minutos para DNS propagar, depois teste:

### Teste 1: Verificar CNAME

```bash
nslookup kanflow.saedadigital.com.br
```

Resultado esperado:
```
Non-authoritative answer:
kanflow.saedadigital.com.br canonical name = saedadigital-ctrl.github.io.
saedadigital-ctrl.github.io canonical name = github.io.
github.io   internet address = 185.199.108.153
github.io   internet address = 185.199.109.153
github.io   internet address = 185.199.110.153
github.io   internet address = 185.199.111.153
```

### Teste 2: Verificar Acesso HTTP

```bash
curl -I http://kanflow.saedadigital.com.br
```

Resultado esperado:
```
HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: text/html; charset=utf-8
```

### Teste 3: Verificar Acesso HTTPS

```bash
curl -I https://kanflow.saedadigital.com.br
```

Resultado esperado:
```
HTTP/2 200
server: GitHub.com
content-type: text/html; charset=utf-8
```

---

## 🔒 Passo 3: Habilitar HTTPS

1. Vá para https://github.com/saedadigital-ctrl/kanflow-crm/settings/pages
2. Na seção "Custom domain", verifique se o domínio está configurado
3. Marque a opção "Enforce HTTPS"
4. Aguarde 5-10 minutos para o certificado SSL ser gerado

---

## 🧪 Teste Final

Após completar os passos acima, acesse:

```
https://kanflow.saedadigital.com.br
```

Você deve ver a aplicação KanFlow CRM funcionando normalmente.

---

## 🆘 Troubleshooting

### Problema: Domínio não resolve

**Solução:**
1. Verifique se o CNAME foi salvo corretamente
2. Aguarde até 48 horas para propagação DNS completa
3. Teste com `nslookup kanflow.saedadigital.com.br`

### Problema: Página mostra "404 - Site not found"

**Solução:**
1. Verifique se o arquivo `public/CNAME` foi commitado
2. Verifique se o workflow de GitHub Actions foi executado com sucesso
3. Limpe o cache do navegador (Ctrl+Shift+Delete)

### Problema: HTTPS não está habilitado

**Solução:**
1. Aguarde 15 minutos após configurar o domínio
2. GitHub gera certificado automaticamente
3. Marque "Enforce HTTPS" nas configurações do repositório

### Problema: Certificado SSL inválido

**Solução:**
1. Aguarde 30 minutos para certificado ser gerado
2. Se persistir, remova e re-adicione o domínio nas configurações

---

## 📊 Status de Propagação DNS

Para verificar o status de propagação em tempo real:

1. Acesse https://www.whatsmydns.net/
2. Digite: `kanflow.saedadigital.com.br`
3. Selecione "CNAME"
4. Verifique o status global de propagação

---

## 📝 Próximas Etapas

Após o domínio estar funcionando:

1. ✅ Atualizar links nos materiais de marketing
2. ✅ Configurar Google Analytics com novo domínio
3. ✅ Testar todas as funcionalidades em produção
4. ✅ Comunicar novo domínio aos usuários

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs em https://github.com/saedadigital-ctrl/kanflow-crm/actions
2. Consulte a documentação oficial: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
3. Entre em contato: suporte@aedadigital.com.br

---

**Última atualização:** 30 de Outubro de 2025  
**Status:** ✅ Pronto para configuração  
**Domínio:** kanflow.saedadigital.com.br

