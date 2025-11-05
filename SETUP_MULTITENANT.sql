-- ============================================
-- KanFlow CRM - Setup Multi-Tenant
-- ============================================
-- Execute este script no Supabase SQL Editor
-- para adicionar suporte a multi-tenant

-- ============================================
-- STEP 1: Criar tabelas de multi-tenant
-- ============================================

-- Tabela: organizations
CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logoUrl TEXT,
  website VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(320),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postalCode VARCHAR(20),
  
  -- Metadata
  plan VARCHAR(50) DEFAULT 'starter',
  status VARCHAR(50) DEFAULT 'active',
  maxUsers INT DEFAULT 5,
  maxContacts INT DEFAULT 1000,
  maxConversations INT DEFAULT 10000,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: organization_members
CREATE TABLE IF NOT EXISTS organization_members (
  id VARCHAR(64) PRIMARY KEY,
  organizationId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  role VARCHAR(50) DEFAULT 'member' NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY unique_org_user (organizationId, userId),
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Tabela: organization_invites
CREATE TABLE IF NOT EXISTS organization_invites (
  id VARCHAR(64) PRIMARY KEY,
  organizationId VARCHAR(64) NOT NULL,
  email VARCHAR(320) NOT NULL,
  role VARCHAR(50) DEFAULT 'member' NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
);

-- ============================================
-- STEP 2: Adicionar coluna organization_id às tabelas existentes
-- ============================================

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS organizationId VARCHAR(64);
ALTER TABLE pipeline_stages ADD COLUMN IF NOT EXISTS organizationId VARCHAR(64);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS organizationId VARCHAR(64);

-- ============================================
-- STEP 3: Criar índices
-- ============================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(plan);
CREATE INDEX IF NOT EXISTS idx_organizations_createdAt ON organizations(createdAt);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organizationId);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_members(userId);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON organization_members(role);
CREATE INDEX IF NOT EXISTS idx_org_members_status ON organization_members(status);

CREATE INDEX IF NOT EXISTS idx_org_invites_org_id ON organization_invites(organizationId);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON organization_invites(email);
CREATE INDEX IF NOT EXISTS idx_org_invites_token ON organization_invites(token);

CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON contacts(organizationId);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_org_id ON pipeline_stages(organizationId);
CREATE INDEX IF NOT EXISTS idx_messages_org_id ON messages(organizationId);

-- ============================================
-- STEP 4: Dados de Demo
-- ============================================

-- Inserir organização de demo
INSERT INTO organizations (id, name, slug, description, plan, status)
VALUES 
  ('org-demo-001', 'Demo Company', 'demo-company', 'Organização de demonstração', 'professional', 'active')
ON DUPLICATE KEY UPDATE updatedAt = CURRENT_TIMESTAMP;

-- ============================================
-- STEP 5: Views para KPIs (Opcional)
-- ============================================

-- View: Contatos por etapa
CREATE OR REPLACE VIEW v_contacts_by_stage AS
SELECT 
  ps.id,
  ps.name,
  ps.color,
  COUNT(c.id) as contact_count,
  ps.organizationId
FROM pipeline_stages ps
LEFT JOIN contacts c ON ps.id = c.stageId
GROUP BY ps.id, ps.name, ps.color, ps.organizationId
ORDER BY ps.`order`;

-- View: Últimas mensagens por contato
CREATE OR REPLACE VIEW v_latest_messages AS
SELECT DISTINCT 
  contactId,
  content,
  direction,
  status,
  createdAt
FROM messages m1
WHERE createdAt = (
  SELECT MAX(createdAt) 
  FROM messages m2 
  WHERE m2.contactId = m1.contactId
);

-- ============================================
-- PRÓXIMOS PASSOS
-- ============================================

-- 1. Migrar dados existentes para a nova estrutura
-- 2. Implementar RLS no Supabase
-- 3. Atualizar backend tRPC com procedures de multi-tenant
-- 4. Atualizar frontend com seletor de organização
-- 5. Testar isolamento de dados por organização

-- ============================================
-- FIM DO SETUP
-- ============================================

