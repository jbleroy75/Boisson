/**
 * Security Headers Configuration
 * Implements OWASP recommended security headers
 */

/**
 * Content Security Policy directives
 */
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development, remove in strict mode
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    'https://js.stripe.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind and styled components
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.shopify.com',
    'https://cdn.shopify.com',
    'https://*.sanity.io',
    'https://cdn.sanity.io',
    'https://www.google-analytics.com',
    'https://www.facebook.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://*.shopify.com',
    'https://api.stripe.com',
    'https://*.sanity.io',
    'https://www.google-analytics.com',
    'https://www.facebook.com',
    'https://connect.facebook.net',
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://www.facebook.com',
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Build CSP header string
 */
export function buildCSPHeader(isDevelopment: boolean = false): string {
  const directives = { ...cspDirectives };

  // Relax some restrictions in development
  if (isDevelopment) {
    directives['connect-src'].push('http://localhost:*', 'ws://localhost:*');
  }

  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Security headers for all responses
 */
export function getSecurityHeaders(isDevelopment: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {
    // Content Security Policy
    'Content-Security-Policy': buildCSPHeader(isDevelopment),

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS filter
    'X-XSS-Protection': '1; mode=block',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy (formerly Feature-Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // Disable FLoC
    ].join(', '),

    // HSTS - Strict Transport Security (production only)
    ...(isDevelopment ? {} : {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    }),
  };

  return headers;
}

/**
 * CORS headers configuration
 */
export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  credentials: boolean;
}

const defaultCorsConfig: CORSConfig = {
  allowedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_B2B_URL || 'http://fournisseurs.localhost:3000',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 86400, // 24 hours
  credentials: true,
};

/**
 * Get CORS headers for a request
 */
export function getCORSHeaders(
  origin: string | null,
  config: Partial<CORSConfig> = {}
): Record<string, string> {
  const corsConfig = { ...defaultCorsConfig, ...config };

  // Check if origin is allowed
  const isAllowedOrigin = origin && (
    corsConfig.allowedOrigins.includes(origin) ||
    corsConfig.allowedOrigins.includes('*')
  );

  if (!isAllowedOrigin) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin || '',
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': corsConfig.exposedHeaders.join(', '),
    'Access-Control-Max-Age': corsConfig.maxAge.toString(),
    ...(corsConfig.credentials && {
      'Access-Control-Allow-Credentials': 'true',
    }),
  };
}

/**
 * Handle CORS preflight request
 */
export function handlePreflight(
  origin: string | null,
  config: Partial<CORSConfig> = {}
): Response {
  const headers = getCORSHeaders(origin, config);

  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: Response,
  isDevelopment: boolean = false
): Response {
  const headers = getSecurityHeaders(isDevelopment);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Request size limits (in bytes)
 */
export const REQUEST_SIZE_LIMITS = {
  json: 1024 * 1024, // 1MB for JSON payloads
  form: 10 * 1024 * 1024, // 10MB for form data (file uploads)
  text: 256 * 1024, // 256KB for text
};

/**
 * Check request size
 */
export async function checkRequestSize(
  request: Request,
  maxSize: number
): Promise<boolean> {
  const contentLength = request.headers.get('content-length');

  if (contentLength) {
    return parseInt(contentLength, 10) <= maxSize;
  }

  // If no content-length, try to read and check
  try {
    const clone = request.clone();
    const body = await clone.arrayBuffer();
    return body.byteLength <= maxSize;
  } catch {
    return false;
  }
}
