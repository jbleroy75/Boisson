/**
 * Next.js Middleware
 * Handles security checks, rate limiting, and request processing
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory for Edge Runtime)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// Stricter limits for specific paths
const PATH_RATE_LIMITS: Record<string, { window: number; max: number }> = {
  '/api/auth': { window: 15 * 60 * 1000, max: 10 }, // 10 requests per 15 min
  '/api/contact': { window: 60 * 60 * 1000, max: 5 }, // 5 per hour
  '/api/b2b/contact': { window: 60 * 60 * 1000, max: 3 }, // 3 per hour
  '/api/subscriptions': { window: 60 * 60 * 1000, max: 10 }, // 10 per hour
};

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

// CSP header (relaxed for development)
function getCSPHeader(isDev: boolean): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://*.shopify.com https://cdn.shopify.com https://*.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://www.facebook.com",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.shopify.com https://api.stripe.com https://*.sanity.io https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net ${isDev ? 'http://localhost:* ws://localhost:*' : ''}`,
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (!isDev) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Check rate limit for a request
 */
function checkRateLimit(
  identifier: string,
  path: string
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();

  // Get limit config for path
  let config = { window: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX_REQUESTS };
  for (const [prefix, limits] of Object.entries(PATH_RATE_LIMITS)) {
    if (path.startsWith(prefix)) {
      config = limits;
      break;
    }
  }

  const key = `${path}:${identifier}`;
  let entry = rateLimitStore.get(key);

  // Clean up or create new entry
  if (!entry || entry.resetTime < now) {
    entry = { count: 0, resetTime: now + config.window };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: entry.count <= config.max,
    remaining: Math.max(0, config.max - entry.count),
    reset: entry.resetTime,
  };
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === 'development';

  // Skip middleware for static files and internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Add security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Add CSP header
  response.headers.set('Content-Security-Policy', getCSPHeader(isDev));

  // Add HSTS in production
  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    // Skip rate limiting for webhooks (they use signature verification)
    if (pathname.includes('/webhooks/')) {
      return response;
    }

    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, pathname);

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.reset.toString());

    if (!rateLimit.allowed) {
      response.headers.set('Retry-After', Math.ceil((rateLimit.reset - Date.now()) / 1000).toString());

      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(response.headers),
          },
        }
      );
    }
  }

  // CORS handling for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      process.env.NEXT_PUBLIC_B2B_URL || 'http://fournisseurs.localhost:3000',
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
      );
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: Object.fromEntries(response.headers),
      });
    }
  }

  // B2B subdomain routing
  const host = request.headers.get('host') || '';
  if (host.startsWith('fournisseurs.') && !pathname.startsWith('/fournisseurs')) {
    // Rewrite to B2B routes
    const url = request.nextUrl.clone();
    url.pathname = `/fournisseurs${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Request size check for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentLength = request.headers.get('content-length');
    const maxSize = pathname.includes('/upload') ? 10 * 1024 * 1024 : 1024 * 1024; // 10MB for uploads, 1MB otherwise

    if (contentLength && parseInt(contentLength, 10) > maxSize) {
      return new NextResponse(
        JSON.stringify({ error: 'Request body too large' }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  return response;
}

/**
 * Matcher configuration - paths to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
