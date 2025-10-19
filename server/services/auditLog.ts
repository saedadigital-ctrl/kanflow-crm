import { createAuditLog } from "../db";
import { auditLogs } from "../../drizzle/schema";

/**
 * Tipos de eventos auditáveis
 */
export enum AuditEventType {
  // Autenticação
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  PASSWORD_CHANGED = "password_changed",
  PASSWORD_RESET_REQUESTED = "password_reset_requested",

  // Usuários
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DELETED = "user_deleted",
  USER_ROLE_CHANGED = "user_role_changed",

  // Organizações
  ORGANIZATION_CREATED = "organization_created",
  ORGANIZATION_UPDATED = "organization_updated",
  ORGANIZATION_SUSPENDED = "organization_suspended",
  ORGANIZATION_ACTIVATED = "organization_activated",
  ORGANIZATION_DELETED = "organization_deleted",

  // WhatsApp
  WHATSAPP_CONNECTED = "whatsapp_connected",
  WHATSAPP_DISCONNECTED = "whatsapp_disconnected",
  MESSAGE_SENT = "message_sent",
  MESSAGE_RECEIVED = "message_received",

  // Dados sensíveis
  DATA_EXPORTED = "data_exported",
  DATA_DELETED = "data_deleted",
  BACKUP_CREATED = "backup_created",

  // Segurança
  UNAUTHORIZED_ACCESS_ATTEMPT = "unauthorized_access_attempt",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",

  // Billing
  PAYMENT_SUCCEEDED = "payment_succeeded",
  PAYMENT_FAILED = "payment_failed",
  SUBSCRIPTION_CREATED = "subscription_created",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled",
}

/**
 * Severidade do evento
 */
export enum AuditSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

/**
 * Interface para log de auditoria
 */
export interface AuditLogEntry {
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Serviço de Auditoria
 */
export class AuditService {
  /**
   * Registra um evento de auditoria
   */
  static async log(entry: Omit<AuditLogEntry, "timestamp">): Promise<void> {
    try {
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventType: entry.eventType,
        severity: entry.severity,
        userId: entry.userId || null,
        organizationId: entry.organizationId || null,
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        timestamp: new Date(),
      });

      // Log crítico também vai para console
      if (entry.severity === AuditSeverity.CRITICAL) {
        console.error("[AUDIT CRITICAL]", JSON.stringify(entry, null, 2));
      }
    } catch (error) {
      console.error("Erro ao registrar log de auditoria:", error);
    }
  }

  /**
   * Registra tentativa de login bem-sucedida
   */
  static async logLoginSuccess(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.LOGIN_SUCCESS,
      severity: AuditSeverity.INFO,
      userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Registra tentativa de login falhada
   */
  static async logLoginFailed(
    email: string,
    ipAddress: string,
    userAgent: string,
    reason: string
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.LOGIN_FAILED,
      severity: AuditSeverity.WARNING,
      ipAddress,
      userAgent,
      metadata: { email, reason },
    });
  }

  /**
   * Registra tentativa de acesso não autorizado
   */
  static async logUnauthorizedAccess(
    userId: string | undefined,
    resource: string,
    ipAddress: string
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
      severity: AuditSeverity.ERROR,
      userId,
      ipAddress,
      metadata: { resource },
    });
  }

  /**
   * Registra atividade suspeita
   */
  static async logSuspiciousActivity(
    description: string,
    userId: string | undefined,
    ipAddress: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
      severity: AuditSeverity.CRITICAL,
      userId,
      ipAddress,
      metadata: { description, ...metadata },
    });
  }

  /**
   * Registra exportação de dados (LGPD)
   */
  static async logDataExport(
    userId: string,
    organizationId: string,
    dataType: string
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.DATA_EXPORTED,
      severity: AuditSeverity.INFO,
      userId,
      organizationId,
      metadata: { dataType },
    });
  }

  /**
   * Registra exclusão de dados (LGPD)
   */
  static async logDataDeletion(
    userId: string,
    organizationId: string,
    dataType: string,
    recordCount: number
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.DATA_DELETED,
      severity: AuditSeverity.WARNING,
      userId,
      organizationId,
      metadata: { dataType, recordCount },
    });
  }

  /**
   * Busca logs de auditoria com filtros
   */
  static async getLogs(filters: {
    organizationId?: string;
    userId?: string;
    eventType?: AuditEventType;
    severity?: AuditSeverity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<any[]> {
    // Implementar query com filtros
    // Por enquanto retorna vazio
    return [];
  }

  /**
   * Detecta padrões suspeitos
   */
  static async detectAnomalies(
    userId: string,
    organizationId: string
  ): Promise<{
    suspicious: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];

    // Verifica múltiplas tentativas de login falhadas
    // Verifica acessos de IPs diferentes em curto período
    // Verifica volume anormal de requisições
    // etc.

    return {
      suspicious: reasons.length > 0,
      reasons,
    };
  }
}

/**
 * Middleware para auditoria automática de rotas sensíveis
 */
export function auditRoute(eventType: AuditEventType, severity: AuditSeverity) {
  return async (req: any, res: any, next: any) => {
    const user = req.user;

    await AuditService.log({
      eventType,
      severity,
      userId: user?.id,
      organizationId: user?.organizationId,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        method: req.method,
        path: req.path,
        body: req.body,
      },
    });

    next();
  };
}

