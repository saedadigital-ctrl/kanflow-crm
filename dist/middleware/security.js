import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createHash, randomBytes } from "crypto";
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas requisições deste IP. Tente novamente em 15 minutos.",
    standardHeaders: true,
    legacyHeaders: false,
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    skipSuccessfulRequests: true,
});
export const whatsappLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Limite de mensagens excedido. Aguarde 1 minuto.",
});
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.manus.im"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});
export const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:3001",
            /\.manus\.space$/,
            /\.manusvm\.computer$/,
        ];
        if (!origin)
            return callback(null, true);
        const isAllowed = allowedOrigins.filter((a) => a !== undefined).some((allowed) => {
            if (typeof allowed === "string")
                return allowed === origin;
            return allowed.test(origin);
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error("Origem não permitida pelo CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
export function sanitizeInput(input) {
    if (typeof input === "string") {
        return input
            .replace(/[<>]/g, "")
            .replace(/javascript:/gi, "")
            .replace(/on\w+=/gi, "")
            .trim();
    }
    if (Array.isArray(input)) {
        return input.map(sanitizeInput);
    }
    if (typeof input === "object" && input !== null) {
        const sanitized = {};
        for (const key in input) {
            sanitized[key] = sanitizeInput(input[key]);
        }
        return sanitized;
    }
    return input;
}
export function sanitizeMiddleware(req, res, next) {
    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    if (req.query) {
        req.query = sanitizeInput(req.query);
    }
    if (req.params) {
        req.params = sanitizeInput(req.params);
    }
    next();
}
export function validateOrganizationAccess(req, res, next) {
    const user = req.user;
    const organizationId = req.params.organizationId || req.body.organizationId;
    if (!user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    if (user.role === "admin") {
        return next();
    }
    if (user.organizationId !== organizationId) {
        return res.status(403).json({
            error: "Acesso negado. Você não tem permissão para acessar esta organização.",
        });
    }
    next();
}
export class Encryption {
    static encrypt(text) {
        const iv = randomBytes(16);
        const cipher = require("crypto").createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        const authTag = cipher.getAuthTag();
        return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
    }
    static decrypt(encryptedText) {
        const parts = encryptedText.split(":");
        const iv = Buffer.from(parts[0], "hex");
        const authTag = Buffer.from(parts[1], "hex");
        const encrypted = parts[2];
        const decipher = require("crypto").createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
    static hash(text) {
        return createHash("sha256").update(text).digest("hex");
    }
}
Encryption.algorithm = "aes-256-gcm";
Encryption.key = Buffer.from(process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex"), "hex");
export function generateSecureToken(length = 32) {
    return randomBytes(length).toString("hex");
}
export function validatePasswordStrength(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push("Senha deve ter no mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Senha deve conter pelo menos uma letra maiúscula");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Senha deve conter pelo menos uma letra minúscula");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Senha deve conter pelo menos um número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Senha deve conter pelo menos um caractere especial");
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
export function auditMiddleware(req, res, next) {
    const user = req.user;
    const startTime = Date.now();
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        userId: user?.id,
        organizationId: user?.organizationId,
    };
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        console.log(JSON.stringify({
            ...logData,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        }));
        return originalSend.call(this, data);
    };
    next();
}
export function csrfProtection(req, res, next) {
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
        const csrfToken = req.headers["x-csrf-token"];
        const sessionToken = req.session?.csrfToken;
        if (!csrfToken || csrfToken !== sessionToken) {
            return res.status(403).json({ error: "Token CSRF inválido" });
        }
    }
    next();
}
export function validateFileUpload(file) {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024;
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return {
            valid: false,
            error: "Tipo de arquivo não permitido",
        };
    }
    if (file.size > maxSize) {
        return {
            valid: false,
            error: "Arquivo muito grande. Máximo 10MB",
        };
    }
    return { valid: true };
}
