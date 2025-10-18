import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createHash, randomBytes } from "crypto";

/**
 * Rate Limiting - Proteção contra ataques de força bruta
 */

// Rate limiter geral para todas as rotas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP
  message: "Muitas requisições deste IP. Tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter rigoroso para login/autenticação
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas de login
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
});

// Rate limiter para API do WhatsApp
export const whatsappLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // Máximo 30 mensagens por minuto
  message: "Limite de mensagens excedido. Aguarde 1 minuto.",
});

/**
 * Helmet - Headers de segurança HTTP
 */
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
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

/**
 * CORS - Configuração segura
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      /\.manus\.space$/,
      /\.manusvm\.computer$/,
    ];

    // Permitir requisições sem origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") return allowed === origin;
      return allowed.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

/**
 * Sanitização de inputs - Previne XSS e SQL Injection
 */
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input
      .replace(/[<>]/g, "") // Remove tags HTML
      .replace(/javascript:/gi, "") // Remove javascript:
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
}

/**
 * Middleware de sanitização automática
 */
export function sanitizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

/**
 * Validação de organização - Garante isolamento multi-tenant
 */
export function validateOrganizationAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  const organizationId = req.params.organizationId || req.body.organizationId;

  if (!user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  // Admin pode acessar qualquer organização
  if (user.role === "admin") {
    return next();
  }

  // Usuário normal só pode acessar sua própria organização
  if (user.organizationId !== organizationId) {
    return res.status(403).json({
      error: "Acesso negado. Você não tem permissão para acessar esta organização.",
    });
  }

  next();
}

/**
 * Criptografia de dados sensíveis
 */
export class Encryption {
  private static algorithm = "aes-256-gcm";
  private static key = Buffer.from(
    process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex"),
    "hex"
  );

  /**
   * Criptografa um texto
   */
  static encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = require("crypto").createCipheriv(
      this.algorithm,
      this.key,
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  /**
   * Descriptografa um texto
   */
  static decrypt(encryptedText: string): string {
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = require("crypto").createDecipheriv(
      this.algorithm,
      this.key,
      iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  /**
   * Hash de senha (one-way)
   */
  static hash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  }
}

/**
 * Gerador de tokens seguros
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Validação de força de senha
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

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

/**
 * Middleware de auditoria - Registra todas as ações importantes
 */
export function auditMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  const startTime = Date.now();

  // Log da requisição
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: user?.id,
    organizationId: user?.organizationId,
  };

  // Intercepta a resposta para logar o resultado
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    console.log(
      JSON.stringify({
        ...logData,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      })
    );
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Proteção contra CSRF (Cross-Site Request Forgery)
 */
export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Verifica se é uma requisição de modificação (POST, PUT, DELETE)
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const csrfToken = req.headers["x-csrf-token"];
    const sessionToken = (req as any).session?.csrfToken;

    if (!csrfToken || csrfToken !== sessionToken) {
      return res.status(403).json({ error: "Token CSRF inválido" });
    }
  }

  next();
}

/**
 * Validação de tipos de arquivo para upload
 */
export function validateFileUpload(
  file: any
): { valid: boolean; error?: string } {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

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

