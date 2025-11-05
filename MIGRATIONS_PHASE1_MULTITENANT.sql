-- ============================================
-- KanFlow CRM - Phase 1: Multi-Tenant + RLS
-- ============================================
-- Versão: 1.0.0
-- Data: Novembro 2024
-- Descrição: Implementar multi-tenant com RLS

-- ============================================
-- STEP 1: Criar tabelas de multi-tenant
-- ============================================

-- Tabela: organizations
-- Descrição: Organizações (empresas/clientes)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Metadata
  plan TEXT DEFAULT 'starter', -- starter, professional, enterprise
  status TEXT DEFAULT 'active', -- active, trialing, suspended, canceled
  max_users INT DEFAULT 5,
  max_contacts INT DEFAULT 1000,
  max_conversations INT DEFAULT 10000,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT org_name_not_empty CHECK (name != ''),
  CONSTRAINT org_slug_not_empty CHECK (slug != '')
);

-- Índices para organizations
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_status ON public.organizations(status);
CREATE INDEX idx_organizations_plan ON public.organizations(plan);
CREATE INDEX idx_organizations_created_at ON public.organizations(created_at);

-- Tabela: organization_members
-- Descrição: Membros de uma organização
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
  status TEXT DEFAULT 'active', -- active, invited, suspended
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(organization_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'invited', 'suspended'))
);

-- Índices para organization_members
CREATE INDEX idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_org_members_role ON public.organization_members(role);
CREATE INDEX idx_org_members_status ON public.organization_members(status);

-- Tabela: organization_invites
-- Descrição: Convites para membros
CREATE TABLE IF NOT EXISTS public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member', 'viewer'))
);

-- Índices para organization_invites
CREATE INDEX idx_org_invites_org_id ON public.organization_invites(organization_id);
CREATE INDEX idx_org_invites_email ON public.organization_invites(email);
CREATE INDEX idx_org_invites_token ON public.organization_invites(token);

-- ============================================
-- STEP 2: Atualizar tabelas existentes
-- ============================================

-- Adicionar coluna organization_id às tabelas existentes
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.pipeline_stages ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Criar índices para organization_id
CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON public.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_org_id ON public.pipeline_stages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_org_id ON public.messages(organization_id);

-- ============================================
-- STEP 3: Criar funções auxiliares
-- ============================================

-- Função: Obter organization_id do usuário logado
CREATE OR REPLACE FUNCTION public.auth_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Função: Obter todas as organizations do usuário logado
CREATE OR REPLACE FUNCTION public.auth_org_ids()
RETURNS TABLE(org_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

-- Função: Verificar se usuário é membro de uma organização
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Função: Verificar se usuário é admin de uma organização
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- STEP 4: Habilitar Row Level Security (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Criar políticas RLS
-- ============================================

-- Políticas para organizations
-- Usuários podem ver suas próprias organizações
CREATE POLICY "Users can view their organizations"
ON public.organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Admins podem atualizar sua organização
CREATE POLICY "Admins can update their organizations"
ON public.organizations FOR UPDATE
USING (
  id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Políticas para organization_members
-- Membros podem ver outros membros da mesma organização
CREATE POLICY "Members can view organization members"
ON public.organization_members FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Admins podem gerenciar membros
CREATE POLICY "Admins can manage organization members"
ON public.organization_members FOR ALL
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Políticas para organization_invites
-- Admins podem criar convites
CREATE POLICY "Admins can create invites"
ON public.organization_invites FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Admins podem ver convites
CREATE POLICY "Admins can view invites"
ON public.organization_invites FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Políticas para contacts
-- Usuários podem ver contatos de suas organizações
CREATE POLICY "Users can view organization contacts"
ON public.contacts FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem criar contatos em suas organizações
CREATE POLICY "Users can create contacts"
ON public.contacts FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem atualizar contatos de suas organizações
CREATE POLICY "Users can update organization contacts"
ON public.contacts FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem deletar contatos de suas organizações
CREATE POLICY "Users can delete organization contacts"
ON public.contacts FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Políticas para pipeline_stages
-- Usuários podem ver etapas de suas organizações
CREATE POLICY "Users can view organization pipeline stages"
ON public.pipeline_stages FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem criar etapas
CREATE POLICY "Users can create pipeline stages"
ON public.pipeline_stages FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem atualizar etapas de suas organizações
CREATE POLICY "Users can update organization pipeline stages"
ON public.pipeline_stages FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Políticas para messages
-- Usuários podem ver mensagens de suas organizações
CREATE POLICY "Users can view organization messages"
ON public.messages FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Usuários podem criar mensagens
CREATE POLICY "Users can create messages"
ON public.messages FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- STEP 6: Dados de Demo
-- ============================================

-- Inserir organização de demo
INSERT INTO public.organizations (id, name, slug, description, plan, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'Demo Company', 'demo-company', 'Organização de demonstração', 'professional', 'active')
ON CONFLICT DO NOTHING;

-- Inserir membros de demo (assumindo que existem usuários)
-- Nota: Você precisa ter usuários criados primeiro
-- INSERT INTO public.organization_members (organization_id, user_id, role, status)
-- VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000'::UUID, 'user-id-aqui', 'owner', 'active')
-- ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 7: Triggers para atualizar updated_at
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para organizations
DROP TRIGGER IF EXISTS trigger_update_organizations_updated_at ON public.organizations;
CREATE TRIGGER trigger_update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para organization_members
DROP TRIGGER IF EXISTS trigger_update_org_members_updated_at ON public.organization_members;
CREATE TRIGGER trigger_update_org_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- FIM DAS MIGRATIONS - PHASE 1
-- ============================================

