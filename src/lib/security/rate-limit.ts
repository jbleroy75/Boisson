/**
 * Rate Limiting Implementation
 * In-memory rate limiter with sliding window algorithm
 * For production, consider using Redis-based solution (@upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Rate limit configurations for different endpoints
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - strict limits
  'auth:login': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 min
  'auth:register': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  'auth:password-reset': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour

  // Contact forms - moderate limits
  'contact:submit': { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  'b2b:contact': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour

  // API endpoints - general limits
  'api:general': { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute
  'api:orders': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 per minute
  'api:subscriptions': { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour

  // Newsletter - strict limits
  'newsletter:subscribe': { windowMs: 24 * 60 * 60 * 1000, maxRequests: 3 }, // 3 per day

  // Default fallback
  default: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute
};

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given identifier and endpoint
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string = 'default'
): RateLimitResult {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const success = entry.count <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: entry.resetTime,
    retryAfter: success ? undefined : Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client identifier from request
 * Uses IP address with fallback to forwarded headers
 */
export function getClientIdentifier(request: Request): string {
  const headers = new Headers(request.headers);

  // Check for forwarded headers (when behind proxy/load balancer)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Get first IP in chain (original client)
    return forwarded.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return 'localhost';
}

/**
 * Reset rate limit for a specific identifier and endpoint
 * Useful after successful authentication
 */
export function resetRateLimit(identifier: string, endpoint: string): void {
  const key = `${endpoint}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Account lockout tracking
 * Tracks failed login attempts and locks accounts
 */
interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const lockoutStore = new Map<string, LockoutEntry>();

const LOCKOUT_CONFIG = {
  maxAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
  attemptWindowMs: 60 * 60 * 1000, // 1 hour
};

export interface LockoutResult {
  isLocked: boolean;
  attemptsRemaining: number;
  lockedUntil: number | null;
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(email: string): LockoutResult {
  const now = Date.now();
  let entry = lockoutStore.get(email);

  // Reset if window expired
  if (!entry || (now - entry.lastAttempt) > LOCKOUT_CONFIG.attemptWindowMs) {
    entry = {
      attempts: 0,
      lockedUntil: null,
      lastAttempt: now,
    };
  }

  // Check if currently locked
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  // Clear lock if expired
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.lockedUntil = null;
    entry.attempts = 0;
  }

  // Record attempt
  entry.attempts++;
  entry.lastAttempt = now;

  // Lock if max attempts exceeded
  if (entry.attempts >= LOCKOUT_CONFIG.maxAttempts) {
    entry.lockedUntil = now + LOCKOUT_CONFIG.lockoutDurationMs;
    lockoutStore.set(email, entry);

    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  lockoutStore.set(email, entry);

  return {
    isLocked: false,
    attemptsRemaining: LOCKOUT_CONFIG.maxAttempts - entry.attempts,
    lockedUntil: null,
  };
}

/**
 * Check if an account is currently locked
 */
export function isAccountLocked(email: string): LockoutResult {
  const entry = lockoutStore.get(email);
  const now = Date.now();

  if (!entry) {
    return {
      isLocked: false,
      attemptsRemaining: LOCKOUT_CONFIG.maxAttempts,
      lockedUntil: null,
    };
  }

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  return {
    isLocked: false,
    attemptsRemaining: LOCKOUT_CONFIG.maxAttempts - entry.attempts,
    lockedUntil: null,
  };
}

/**
 * Clear lockout after successful login
 */
export function clearLockout(email: string): void {
  lockoutStore.delete(email);
}
