import { createAuditLog } from "../db";
/**
 * Tipos de eventos auditáveis
 */
export var AuditEventType;
(function (AuditEventType) {
    // Autenticação
    AuditEventType["LOGIN_SUCCESS"] = "login_success";
    AuditEventType["LOGIN_FAILED"] = "login_failed";
    AuditEventType["LOGOUT"] = "logout";
    AuditEventType["PASSWORD_CHANGED"] = "password_changed";
    AuditEventType["PASSWORD_RESET_REQUESTED"] = "password_reset_requested";
    // Usuários
    AuditEventType["USER_CREATED"] = "user_created";
    AuditEventType["USER_UPDATED"] = "user_updated";
    AuditEventType["USER_DELETED"] = "user_deleted";
    AuditEventType["USER_ROLE_CHANGED"] = "user_role_changed";
    // Organizações
    AuditEventType["ORGANIZATION_CREATED"] = "organization_created";
    AuditEventType["ORGANIZATION_UPDATED"] = "organization_updated";
    AuditEventType["ORGANIZATION_SUSPENDED"] = "organization_suspended";
    AuditEventType["ORGANIZATION_ACTIVATED"] = "organization_activated";
    AuditEventType["ORGANIZATION_DELETED"] = "organization_deleted";
    // WhatsApp
    AuditEventType["WHATSAPP_CONNECTED"] = "whatsapp_connected";
    AuditEventType["WHATSAPP_DISCONNECTED"] = "whatsapp_disconnected";
    AuditEventType["MESSAGE_SENT"] = "message_sent";
    AuditEventType["MESSAGE_RECEIVED"] = "message_received";
    // Dados sensíveis
    AuditEventType["DATA_EXPORTED"] = "data_exported";
    AuditEventType["DATA_DELETED"] = "data_deleted";
    AuditEventType["BACKUP_CREATED"] = "backup_created";
    // Segurança
    AuditEventType["UNAUTHORIZED_ACCESS_ATTEMPT"] = "unauthorized_access_attempt";
    AuditEventType["RATE_LIMIT_EXCEEDED"] = "rate_limit_exceeded";
    AuditEventType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    // Billing
    AuditEventType["PAYMENT_SUCCEEDED"] = "payment_succeeded";
    AuditEventType["PAYMENT_FAILED"] = "payment_failed";
    AuditEventType["SUBSCRIPTION_CREATED"] = "subscription_created";
    AuditEventType["SUBSCRIPTION_CANCELLED"] = "subscription_cancelled";
})(AuditEventType || (AuditEventType = {}));
/**
 * Severidade do evento
 */
export var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "info";
    AuditSeverity["WARNING"] = "warning";
    AuditSeverity["ERROR"] = "error";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity || (AuditSeverity = {}));
/**
 * Serviço de Auditoria
 */
export class AuditService {
    /**
     * Registra um evento de auditoria
     */
    static async log(entry) {
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
        }
        catch (error) {
            console.error("Erro ao registrar log de auditoria:", error);
        }
    }
    /**
     * Registra tentativa de login bem-sucedida
     */
    static async logLoginSuccess(userId, ipAddress, userAgent) {
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
    static async logLoginFailed(email, ipAddress, userAgent, reason) {
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
    static async logUnauthorizedAccess(userId, resource, ipAddress) {
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
    static async logSuspiciousActivity(description, userId, ipAddress, metadata) {
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
    static async logDataExport(userId, organizationId, dataType) {
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
    static async logDataDeletion(userId, organizationId, dataType, recordCount) {
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
    static async getLogs(filters) {
        // Implementar query com filtros
        // Por enquanto retorna vazio
        return [];
    }
    /**
     * Detecta padrões suspeitos
     */
    static async detectAnomalies(userId, organizationId) {
        const reasons = [];
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
export function auditRoute(eventType, severity) {
    return async (req, res, next) => {
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
