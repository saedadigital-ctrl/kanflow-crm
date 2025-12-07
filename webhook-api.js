// ====================================================================
// WEBHOOK SERVER STANDALONE - KANFLOW CRM
// ====================================================================
// Servidor independente para receber leads do site e salvar no MySQL
// ====================================================================

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || 'mysql.railway.internal',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'railway'
};

// Pool de conexões
let pool;

// Inicializar pool de conexões
async function initDatabase() {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Testar conexão
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    return false;
  }
}

// ====================================================================
// ROTAS DA API
// ====================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'webhook-api', timestamp: new Date().toISOString() });
});

// Receber lead do site
app.post('/api/webhook/lead', async (req, res) => {
  try {
    const { name, phone, email, subject, message, source } = req.body;
    
    // Validar dados obrigatórios
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: name, phone, message'
      });
    }
    
    console.log('📩 Novo lead recebido:', { name, phone, email, source });
    
    // Inserir lead no banco de dados
    const query = `
      INSERT INTO leads (name, phone, email, subject, message, source, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [
      name,
      phone,
      email || null,
      subject || null,
      message,
      source || 'website'
    ]);
    
    console.log('✅ Lead salvo no banco de dados! ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Lead recebido com sucesso!',
      leadId: result.insertId
    });
    
  } catch (error) {
    console.error('❌ Erro ao processar lead:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar lead',
      details: error.message
    });
  }
});

// Listar imóveis
app.get('/api/webhook/properties', async (req, res) => {
  try {
    const { status = 'available', limit = 10 } = req.query;
    
    const query = `
      SELECT * FROM properties 
      WHERE status = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const [rows] = await pool.execute(query, [status, parseInt(limit)]);
    
    res.json({
      success: true,
      count: rows.length,
      properties: rows
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar imóveis:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar imóveis',
      details: error.message
    });
  }
});

// Obter imóvel específico
app.get('/api/webhook/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM properties WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Imóvel não encontrado'
      });
    }
    
    res.json({
      success: true,
      property: rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar imóvel:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar imóvel',
      details: error.message
    });
  }
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// ====================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ====================================================================

async function startServer() {
  console.log('🚀 Iniciando Webhook Server...');
  console.log('📦 Configuração do banco de dados:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  });
  
  // Inicializar banco de dados
  const dbConnected = await initDatabase();
  
  if (!dbConnected) {
    console.error('❌ Não foi possível conectar ao banco de dados!');
    console.error('⚠️ O servidor vai iniciar, mas as rotas não funcionarão corretamente.');
  }
  
  // Iniciar servidor HTTP
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Webhook Server rodando na porta ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📡 API Lead: POST http://localhost:${PORT}/api/webhook/lead`);
    console.log(`🏠 API Properties: GET http://localhost:${PORT}/api/webhook/properties`);
  });
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();
