/**
 * Secure API Route Utilities
 * Helpers for building secure API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasMinimumRole } from '../auth';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders } from './rate-limit';
import { logAuditEvent, getAuditContext } from './audit';
import { validateRequestBody, ValidationError } from '../validations';
import { sanitizeObject, sanitizePlainText } from './sanitize';
import type { z } from 'zod';
import type { UserRole } from '@/types';

export interface ApiContext {
  request: NextRequest;
  session: Awaited<ReturnType<typeof getServerSession>>;
  userId: string | null;
  userRole: UserRole | null;
  clientIp: string;
  userAgent: string;
}

export interface SecureApiOptions {
  /** Require authentication */
  requireAuth?: boolean;
  /** Minimum role required */
  requiredRole?: UserRole;
  /** Rate limit endpoint identifier */
  rateLimit?: string;
  /** Zod schema for request body validation */
  schema?: z.ZodType;
  /** Sanitize request body */
  sanitize?: boolean;
  /** Log the request in audit trail */
  audit?: boolean;
}

/**
 * Create a secure API handler with built-in security features
 */
export function createSecureHandler<T = unknown>(
  options: SecureApiOptions,
  handler: (context: ApiContext, body: T) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    const clientIp = getClientIdentifier(request);
    const { userAgent } = getAuditContext(request);

    // Rate limiting
    if (options.rateLimit) {
      const rateLimitResult = checkRateLimit(clientIp, options.rateLimit);

      if (!rateLimitResult.success) {
        return NextResponse.json(
          { error: 'Trop de requêtes. Réessayez plus tard.' },
          {
            status: 429,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        );
      }
    }

    // Authentication
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const userRole = (session?.user?.role as UserRole) || null;

    if (options.requireAuth && !session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (options.requiredRole && userRole) {
      if (!hasMinimumRole(userRole, options.requiredRole)) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
      }
    }

    // Body validation and sanitization
    let body: T = {} as T;

    if (options.schema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const validatedBody = await validateRequestBody(request, options.schema);
        body = validatedBody as T;

        if (options.sanitize) {
          body = sanitizeObject(body as Record<string, unknown>, sanitizePlainText) as T;
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          return NextResponse.json(error.toJSON(), { status: 400 });
        }
        return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
      }
    }

    // Create context
    const context: ApiContext = {
      request,
      session,
      userId,
      userRole,
      clientIp,
      userAgent,
    };

    try {
      // Call the actual handler
      const response = await handler(context, body);

      // Audit logging
      if (options.audit && response.status < 400) {
        await logAuditEvent({
          action: 'api:general' as any,
          userId: userId || undefined,
          ipAddress: clientIp,
          userAgent,
          resource: request.nextUrl.pathname,
          severity: 'info',
        });
      }

      return response;
    } catch (error) {
      console.error(`API Error [${request.nextUrl.pathname}]:`, error);

      // Log error
      await logAuditEvent({
        action: 'security:suspicious_activity' as any,
        userId: userId || undefined,
        ipAddress: clientIp,
        userAgent,
        resource: request.nextUrl.pathname,
        severity: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      return NextResponse.json(
        { error: 'Une erreur est survenue' },
        { status: 500 }
      );
    }
  };
}

/**
 * Standard API response helpers
 */
export const ApiResponse = {
  success: <T>(data: T, status = 200) =>
    NextResponse.json(data, { status }),

  created: <T>(data: T) =>
    NextResponse.json(data, { status: 201 }),

  noContent: () =>
    new NextResponse(null, { status: 204 }),

  badRequest: (message = 'Requête invalide', details?: Record<string, unknown>) =>
    NextResponse.json({ error: message, details }, { status: 400 }),

  unauthorized: (message = 'Non autorisé') =>
    NextResponse.json({ error: message }, { status: 401 }),

  forbidden: (message = 'Accès refusé') =>
    NextResponse.json({ error: message }, { status: 403 }),

  notFound: (message = 'Ressource non trouvée') =>
    NextResponse.json({ error: message }, { status: 404 }),

  conflict: (message = 'Conflit') =>
    NextResponse.json({ error: message }, { status: 409 }),

  tooManyRequests: (retryAfter?: number) =>
    NextResponse.json(
      { error: 'Trop de requêtes', retryAfter },
      {
        status: 429,
        headers: retryAfter ? { 'Retry-After': retryAfter.toString() } : {},
      }
    ),

  serverError: (message = 'Erreur serveur') =>
    NextResponse.json({ error: message }, { status: 500 }),
};

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

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
 * Parse pagination from query params
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build pagination response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}
