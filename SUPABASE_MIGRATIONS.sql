-- KanFlow CRM - Supabase Migrations
-- Versão: 1.0.0
-- Data: Novembro de 2024

-- ============================================
-- TABELA: users
-- Descrição: Usuários do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT users_email_unique UNIQUE(email)
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ============================================
-- TABELA: pipeline_stages
-- Descrição: Etapas do funil de vendas
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INT NOT NULL,
  color VARCHAR(7) DEFAULT '#3b82f6',
  user_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT pipeline_stages_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para pipeline_stages
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_user_id ON pipeline_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_order ON pipeline_stages("order");

-- ============================================
-- TABELA: contacts
-- Descrição: Contatos (leads/clientes)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(320),
  avatar_url TEXT,
  notes TEXT,
  stage_id VARCHAR(64),
  user_id VARCHAR(64) NOT NULL,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT contacts_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT contacts_stage_id_fk FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id) ON DELETE SET NULL
);

-- Índices para contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_stage_id ON contacts(stage_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- ============================================
-- TABELA: messages
-- Descrição: Histórico de mensagens
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  contact_id VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  direction VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  media_url TEXT,
  media_type VARCHAR(50),
  sent_by VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT messages_contact_id_fk FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  CONSTRAINT messages_sent_by_fk FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para messages
CREATE INDEX IF NOT EXISTS idx_messages_contact_id ON messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sent_by ON messages(sent_by);

-- ============================================
-- TABELA: notifications (Opcional)
-- Descrição: Notificações em tempo real
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT notifications_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- TABELA: audit_logs (Opcional)
-- Descrição: Log de auditoria de ações
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(64),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT audit_logs_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- DADOS DE DEMO (Opcional)
-- ============================================

-- Inserir usuário de demo
INSERT INTO users (id, name, email, login_method, role, created_at, last_signed_in)
VALUES 
  ('demo-user-1', 'Admin Demo', 'admin@demo.com', 'demo', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('demo-user-2', 'User Demo', 'user@demo.com', 'demo', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Inserir etapas de pipeline
INSERT INTO pipeline_stages (id, name, description, "order", color, user_id, created_at, updated_at)
VALUES 
  ('stage-1', 'Prospectando', 'Leads em prospecção', 0, '#3b82f6', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('stage-2', 'Qualificado', 'Leads qualificados', 1, '#06b6d4', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('stage-3', 'Negociando', 'Em negociação', 2, '#f59e0b', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('stage-4', 'Fechado', 'Vendas fechadas', 3, '#10b981', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Inserir contatos de demo
INSERT INTO contacts (id, name, phone_number, email, stage_id, user_id, created_at, updated_at)
VALUES 
  ('contact-1', 'João Silva', '+5511999999999', 'joao@example.com', 'stage-1', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-2', 'Maria Santos', '+5511988888888', 'maria@example.com', 'stage-2', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-3', 'Pedro Oliveira', '+5511977777777', 'pedro@example.com', 'stage-3', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-4', 'Ana Costa', '+5511966666666', 'ana@example.com', 'stage-4', 'demo-user-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Inserir mensagens de demo
INSERT INTO messages (id, contact_id, content, direction, status, sent_by, created_at)
VALUES 
  ('msg-1', 'contact-1', 'Olá João, tudo bem?', 'outbound', 'delivered', 'demo-user-1', CURRENT_TIMESTAMP),
  ('msg-2', 'contact-1', 'Oi! Tudo certo por aqui!', 'inbound', 'read', 'contact-1', CURRENT_TIMESTAMP),
  ('msg-3', 'contact-2', 'Maria, gostaria de agendar uma reunião', 'outbound', 'delivered', 'demo-user-1', CURRENT_TIMESTAMP),
  ('msg-4', 'contact-2', 'Claro! Que dia você tem disponibilidade?', 'inbound', 'read', 'contact-2', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VIEWS (Opcional)
-- ============================================

-- View: Contatos por etapa
CREATE OR REPLACE VIEW contacts_by_stage AS
SELECT 
  ps.id,
  ps.name,
  ps.color,
  COUNT(c.id) as contact_count,
  ps.user_id
FROM pipeline_stages ps
LEFT JOIN contacts c ON ps.id = c.stage_id
GROUP BY ps.id, ps.name, ps.color, ps.user_id
ORDER BY ps."order";

-- View: Últimas mensagens por contato
CREATE OR REPLACE VIEW latest_messages AS
SELECT DISTINCT ON (contact_id)
  contact_id,
  content,
  direction,
  status,
  created_at
FROM messages
ORDER BY contact_id, created_at DESC;

-- ============================================
-- FUNÇÕES (Opcional)
-- ============================================

-- Função: Atualizar last_signed_in do usuário
CREATE OR REPLACE FUNCTION update_user_last_signed_in()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_signed_in = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar last_signed_in quando houver atividade
CREATE TRIGGER trigger_update_last_signed_in
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_user_last_signed_in();

-- Função: Atualizar last_message_at do contato
CREATE OR REPLACE FUNCTION update_contact_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contacts SET last_message_at = NEW.created_at WHERE id = NEW.contact_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar last_message_at quando houver nova mensagem
CREATE TRIGGER trigger_update_contact_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_contact_last_message();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios dados
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid()::text = id OR role = 'admin');

-- Política: Contatos só vistos pelo proprietário
CREATE POLICY "Users can view own contacts"
ON contacts FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own contacts"
ON contacts FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own contacts"
ON contacts FOR UPDATE
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own contacts"
ON contacts FOR DELETE
USING (user_id = auth.uid()::text);

-- Política: Mensagens só vistas pelo proprietário do contato
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (
  contact_id IN (
    SELECT id FROM contacts WHERE user_id = auth.uid()::text
  )
);

-- ============================================
-- FIM DAS MIGRATIONS
-- ============================================

