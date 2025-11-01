import { createAuditLog } from "../db.js";
export var AuditEventType;
(function (AuditEventType) {
    AuditEventType["LOGIN_SUCCESS"] = "login_success";
    AuditEventType["LOGIN_FAILED"] = "login_failed";
    AuditEventType["LOGOUT"] = "logout";
    AuditEventType["PASSWORD_CHANGED"] = "password_changed";
    AuditEventType["PASSWORD_RESET_REQUESTED"] = "password_reset_requested";
    AuditEventType["USER_CREATED"] = "user_created";
    AuditEventType["USER_UPDATED"] = "user_updated";
    AuditEventType["USER_DELETED"] = "user_deleted";
    AuditEventType["USER_ROLE_CHANGED"] = "user_role_changed";
    AuditEventType["ORGANIZATION_CREATED"] = "organization_created";
    AuditEventType["ORGANIZATION_UPDATED"] = "organization_updated";
    AuditEventType["ORGANIZATION_SUSPENDED"] = "organization_suspended";
    AuditEventType["ORGANIZATION_ACTIVATED"] = "organization_activated";
    AuditEventType["ORGANIZATION_DELETED"] = "organization_deleted";
    AuditEventType["WHATSAPP_CONNECTED"] = "whatsapp_connected";
    AuditEventType["WHATSAPP_DISCONNECTED"] = "whatsapp_disconnected";
    AuditEventType["MESSAGE_SENT"] = "message_sent";
    AuditEventType["MESSAGE_RECEIVED"] = "message_received";
    AuditEventType["DATA_EXPORTED"] = "data_exported";
    AuditEventType["DATA_DELETED"] = "data_deleted";
    AuditEventType["BACKUP_CREATED"] = "backup_created";
    AuditEventType["UNAUTHORIZED_ACCESS_ATTEMPT"] = "unauthorized_access_attempt";
    AuditEventType["RATE_LIMIT_EXCEEDED"] = "rate_limit_exceeded";
    AuditEventType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    AuditEventType["PAYMENT_SUCCEEDED"] = "payment_succeeded";
    AuditEventType["PAYMENT_FAILED"] = "payment_failed";
    AuditEventType["SUBSCRIPTION_CREATED"] = "subscription_created";
    AuditEventType["SUBSCRIPTION_CANCELLED"] = "subscription_cancelled";
})(AuditEventType || (AuditEventType = {}));
export var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "info";
    AuditSeverity["WARNING"] = "warning";
    AuditSeverity["ERROR"] = "error";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity || (AuditSeverity = {}));
export class AuditService {
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
            if (entry.severity === AuditSeverity.CRITICAL) {
                console.error("[AUDIT CRITICAL]", JSON.stringify(entry, null, 2));
            }
        }
        catch (error) {
            console.error("Erro ao registrar log de auditoria:", error);
        }
    }
    static async logLoginSuccess(userId, ipAddress, userAgent) {
        await this.log({
            eventType: AuditEventType.LOGIN_SUCCESS,
            severity: AuditSeverity.INFO,
            userId,
            ipAddress,
            userAgent,
        });
    }
    static async logLoginFailed(email, ipAddress, userAgent, reason) {
        await this.log({
            eventType: AuditEventType.LOGIN_FAILED,
            severity: AuditSeverity.WARNING,
            ipAddress,
            userAgent,
            metadata: { email, reason },
        });
    }
    static async logUnauthorizedAccess(userId, resource, ipAddress) {
        await this.log({
            eventType: AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
            severity: AuditSeverity.ERROR,
            userId,
            ipAddress,
            metadata: { resource },
        });
    }
    static async logSuspiciousActivity(description, userId, ipAddress, metadata) {
        await this.log({
            eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
            severity: AuditSeverity.CRITICAL,
            userId,
            ipAddress,
            metadata: { description, ...metadata },
        });
    }
    static async logDataExport(userId, organizationId, dataType) {
        await this.log({
            eventType: AuditEventType.DATA_EXPORTED,
            severity: AuditSeverity.INFO,
            userId,
            organizationId,
            metadata: { dataType },
        });
    }
    static async logDataDeletion(userId, organizationId, dataType, recordCount) {
        await this.log({
            eventType: AuditEventType.DATA_DELETED,
            severity: AuditSeverity.WARNING,
            userId,
            organizationId,
            metadata: { dataType, recordCount },
        });
    }
    static async getLogs(filters) {
        return [];
    }
    static async detectAnomalies(userId, organizationId) {
        const reasons = [];
        return {
            suspicious: reasons.length > 0,
            reasons,
        };
    }
}
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
