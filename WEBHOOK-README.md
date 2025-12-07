# Kanflow Webhook API - Standalone

Servidor webhook independente para receber leads do site Adriano Castro Imóveis e salvar no CRM Kanflow.

## 🎯 Objetivo

Este servidor roda **separadamente** do CRM principal e fornece uma API REST pública para:
- Receber leads do formulário de contato do site
- Listar imóveis disponíveis
- Obter detalhes de imóveis específicos

## 🚀 Deploy no Railway

### Opção 1: Deploy via GitHub

1. Criar um novo repositório no GitHub
2. Fazer push deste código
3. No Railway, criar um novo serviço
4. Conectar ao repositório GitHub
5. Configurar variáveis de ambiente

### Opção 2: Deploy direto (Railway CLI)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar ao projeto existente
railway link

# Deploy
railway up
```

## 🔧 Variáveis de Ambiente

Configure as seguintes variáveis no Railway:

```env
PORT=8080
MYSQL_HOST=mysql.railway.internal
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=<senha-do-mysql>
MYSQL_DATABASE=railway
```

**Importante:** Use as mesmas credenciais do banco MySQL do CRM principal!

## 📡 Endpoints da API

### Health Check
```
GET /health
```

### Receber Lead
```
POST /api/webhook/lead
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "83999999999",
  "email": "joao@example.com",
  "subject": "Interesse em imóvel",
  "message": "Gostaria de mais informações",
  "source": "adrianocastroimoveis.manus.space"
}
```

### Listar Imóveis
```
GET /api/webhook/properties?status=available&limit=10
```

### Obter Imóvel
```
GET /api/webhook/properties/:id
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: leads

```sql
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  source VARCHAR(255),
  status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: properties

```sql
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2),
  location VARCHAR(255),
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  images JSON,
  status ENUM('available', 'sold', 'rented') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔗 Integração com o Site

No site, use o seguinte código JavaScript:

```javascript
async function enviarLead(dados) {
  const response = await fetch('https://webhook-api.railway.app/api/webhook/lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  const result = await response.json();
  return result;
}
```

## 📝 Logs

Os logs do servidor incluem:
- ✅ Conexão com MySQL
- 📩 Leads recebidos
- ❌ Erros de processamento

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em modo desenvolvimento
npm run dev

# Rodar em modo produção
npm start
```

## ⚠️ Observações

- Este servidor NÃO depende do código TypeScript do CRM principal
- Ele acessa diretamente o banco de dados MySQL
- Pode rodar em um serviço separado no Railway
- Não quebra o CRM existente
