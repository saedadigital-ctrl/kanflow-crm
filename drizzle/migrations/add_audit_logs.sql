-- Tabela de logs de auditoria para compliance LGPD
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  user_id VARCHAR(255),
  organization_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);

-- Índice composto para queries comuns
CREATE INDEX idx_audit_logs_org_timestamp ON audit_logs(organization_id, timestamp DESC);

COMMENT ON TABLE audit_logs IS 'Logs de auditoria para compliance LGPD e segurança';
COMMENT ON COLUMN audit_logs.event_type IS 'Tipo de evento auditado';
COMMENT ON COLUMN audit_logs.severity IS 'Nível de severidade do evento';
COMMENT ON COLUMN audit_logs.metadata IS 'Dados adicionais do evento em formato JSON';

