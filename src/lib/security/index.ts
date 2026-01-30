/**
 * Security Module - Main Export
 * Centralizes all security-related functionality
 */

// Rate Limiting
export {
  checkRateLimit,
  getClientIdentifier,
  resetRateLimit,
  getRateLimitHeaders,
  recordFailedAttempt,
  isAccountLocked,
  clearLockout,
  RATE_LIMITS,
  type RateLimitResult,
  type LockoutResult,
} from './rate-limit';

// Sanitization
export {
  sanitizeHtml,
  sanitizeRichText,
  sanitizePlainText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeSiret,
  sanitizePostalCode,
  sanitizeUrl,
  sanitizeRedirectUrl,
  sanitizeFilename,
  sanitizeObject,
  containsXssPayload,
  escapeSqlLike,
} from './sanitize';

// Audit Logging
export {
  logAuditEvent,
  logAuthEvent,
  logRateLimitExceeded,
  logGdprEvent,
  queryAuditLogs,
  getAuditContext,
  type AuditAction,
  type AuditLogEntry,
} from './audit';

// CSRF Protection
export {
  generateCSRFToken,
  createCSRFToken,
  validateCSRFToken,
  getCSRFToken,
  requireCSRFToken,
  signToken,
  verifySignedToken,
} from './csrf';

// Security Headers
export {
  getSecurityHeaders,
  getCORSHeaders,
  handlePreflight,
  applySecurityHeaders,
  buildCSPHeader,
  checkRequestSize,
  REQUEST_SIZE_LIMITS,
  type CORSConfig,
} from './headers';

// GDPR Compliance
export {
  exportUserData,
  deleteUserData,
  createGdprRequest,
  updateGdprRequestStatus,
  recordCookieConsent,
  getCookieConsent,
  formatDataExport,
  type UserData,
} from './gdpr';

// API Utilities
export {
  createSecureHandler,
  ApiResponse,
  verifyWebhookSignature as verifyWebhook,
  parsePagination,
  paginatedResponse,
  type ApiContext,
  type SecureApiOptions,
} from './api-utils';

/**
 * Webhook signature verification helper
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac(algorithm, secret)
    .update(payload)
    .digest('hex');

  // Constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data (for storage or comparison)
 */
export function hashData(data: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, showChars: number = 4): string {
  if (!data || data.length <= showChars * 2) {
    return '***';
  }
  const start = data.slice(0, showChars);
  const end = data.slice(-showChars);
  return `${start}***${end}`;
}

/**
 * Validate password strength
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePasswordStrength(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLong = password.length >= 12;

  if (errors.length === 0) {
    if (hasSpecial && isLong) {
      strength = 'strong';
    } else if (hasSpecial || isLong) {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Check for common/breached passwords
 */
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'login', 'abc123', 'iloveyou', 'trustno1',
];

export function isCommonPassword(password: string): boolean {
  const normalized = password.toLowerCase().trim();
  return COMMON_PASSWORDS.some(common =>
    normalized === common || normalized.includes(common)
  );
}

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Session settings
  SESSION_MAX_AGE: 24 * 60 * 60, // 24 hours (reduced from 30 days)
  REMEMBER_ME_MAX_AGE: 7 * 24 * 60 * 60, // 7 days when "remember me" is checked

  // Password settings
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_SALT_ROUNDS: 12,

  // Account lockout
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes

  // Token expiry
  PASSWORD_RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000, // 1 hour
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  CSRF_TOKEN_EXPIRY_MS: 60 * 60 * 1000, // 1 hour

  // Rate limits
  API_RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  API_RATE_LIMIT_MAX_REQUESTS: 60,

  // Request limits
  MAX_JSON_SIZE: 1024 * 1024, // 1MB
  MAX_FORM_SIZE: 10 * 1024 * 1024, // 10MB
} as const;
