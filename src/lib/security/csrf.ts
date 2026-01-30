/**
 * CSRF Protection
 * Token-based CSRF protection for form submissions
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface CSRFTokenData {
  token: string;
  expires: number;
}

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and set CSRF token in cookie
 */
export async function createCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const expires = Date.now() + TOKEN_EXPIRY_MS;

  const tokenData: CSRFTokenData = { token, expires };
  const encoded = Buffer.from(JSON.stringify(tokenData)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY_MS / 1000,
    path: '/',
  });

  return token;
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(request: Request): Promise<boolean> {
  // Get token from header or body
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Get token from cookie
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!cookieValue || !headerToken) {
    return false;
  }

  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
    const tokenData: CSRFTokenData = JSON.parse(decoded);

    // Check expiry
    if (tokenData.expires < Date.now()) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(tokenData.token),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}

/**
 * Get CSRF token from cookie (for sending to client)
 */
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
    const tokenData: CSRFTokenData = JSON.parse(decoded);

    if (tokenData.expires < Date.now()) {
      return null;
    }

    return tokenData.token;
  } catch {
    return null;
  }
}

/**
 * CSRF middleware for API routes
 * Use this in routes that modify data
 */
export async function requireCSRFToken(request: Request): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Skip for safe methods
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (safeMethod) {
    return { valid: true };
  }

  // Skip for webhook endpoints (they use signature verification instead)
  const url = new URL(request.url);
  if (url.pathname.includes('/webhooks/')) {
    return { valid: true };
  }

  // Validate token
  const isValid = await validateCSRFToken(request);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or missing CSRF token',
    };
  }

  return { valid: true };
}

/**
 * Double Submit Cookie Pattern
 * Alternative CSRF protection using signed cookies
 */
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'default-csrf-secret';

export function signToken(token: string): string {
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(token);
  return `${token}.${hmac.digest('hex')}`;
}

export function verifySignedToken(signedToken: string): boolean {
  const parts = signedToken.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [token, signature] = parts;
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(token);
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
