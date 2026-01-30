/**
 * Input Sanitization and XSS Prevention
 * Uses regex-based sanitization for server-side compatibility
 */

/**
 * Remove all HTML tags from a string
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all potentially dangerous HTML/JS
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Remove script tags and their content
  let cleaned = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and data: URLs
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:/gi, '');

  // Remove iframe, object, embed tags
  cleaned = cleaned.replace(/<(iframe|object|embed|svg|math|link|style|form)[^>]*>.*?<\/\1>/gi, '');
  cleaned = cleaned.replace(/<(iframe|object|embed|svg|math|link|style|form)[^>]*\/?>/gi, '');

  // Keep only allowed tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  const tagPattern = new RegExp(
    `<(?!\/?(?:${allowedTags.join('|')})\\b)[^>]+>`,
    'gi'
  );
  cleaned = cleaned.replace(tagPattern, '');

  return cleaned.trim();
}

/**
 * Sanitize HTML for rich text content (like blog posts)
 * Allows more formatting tags but still safe
 */
export function sanitizeRichText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Remove script tags and their content
  let cleaned = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and data: URLs
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:/gi, '');

  // Remove dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'svg', 'math', 'link', 'style', 'form', 'input', 'button'];
  for (const tag of dangerousTags) {
    const pattern = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, 'gi');
    cleaned = cleaned.replace(pattern, '');
    const selfClosing = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
    cleaned = cleaned.replace(selfClosing, '');
  }

  // Add rel="noopener noreferrer" to links
  cleaned = cleaned.replace(/<a\s+([^>]*href)/gi, '<a rel="noopener noreferrer" $1');

  return cleaned.trim();
}

/**
 * Sanitize plain text - remove all HTML
 */
export function sanitizePlainText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Strip all HTML tags
  const cleaned = stripHtmlTags(dirty);

  // Decode common HTML entities
  return decodeHtmlEntities(cleaned).trim();
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };

  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';

  // Remove any HTML/script tags first
  const cleaned = sanitizePlainText(email);

  // Only keep valid email characters
  return cleaned
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+-]/g, '');
}

/**
 * Sanitize phone number - keep only digits and allowed chars
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  return phone.replace(/[^0-9+\-.\s()]/g, '').trim();
}

/**
 * Sanitize SIRET number - keep only digits
 */
export function sanitizeSiret(siret: string): string {
  if (!siret || typeof siret !== 'string') return '';

  return siret.replace(/\D/g, '');
}

/**
 * Sanitize postal code (French format)
 */
export function sanitizePostalCode(code: string): string {
  if (!code || typeof code !== 'string') return '';

  return code.replace(/\D/g, '').slice(0, 5);
}

/**
 * Sanitize URL - validate and clean
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Prevent javascript: and data: URLs
    if (parsed.href.toLowerCase().includes('javascript:') ||
        parsed.href.toLowerCase().includes('data:')) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize redirect URL - prevent open redirects
 */
export function sanitizeRedirectUrl(url: string, allowedHosts: string[]): string {
  if (!url || typeof url !== 'string') return '/';

  // Allow relative URLs
  if (url.startsWith('/') && !url.startsWith('//')) {
    // Ensure it doesn't contain any protocols
    if (!url.includes(':')) {
      return url;
    }
  }

  try {
    const parsed = new URL(url);

    // Check if host is in allowed list
    if (allowedHosts.includes(parsed.host)) {
      return parsed.href;
    }
  } catch {
    // Invalid URL, return safe default
  }

  return '/';
}

/**
 * Escape string for use in SQL LIKE patterns
 */
export function escapeSqlLike(str: string): string {
  if (!str || typeof str !== 'string') return '';

  return str
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/**
 * Sanitize filename - remove path traversal and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'file';

  return filename
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Keep only safe characters
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    // Limit length
    .slice(0, 255)
    // Remove leading dots
    .replace(/^\.+/, '')
    || 'file';
}

/**
 * Sanitize object recursively
 * Sanitizes all string values in an object
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sanitizer: (str: string) => string = sanitizePlainText
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizer(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizer(item)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item as Record<string, unknown>, sanitizer)
            : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>, sanitizer);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Check if a string contains potential XSS payloads
 */
export function containsXssPayload(str: string): boolean {
  if (!str || typeof str !== 'string') return false;

  const xssPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe\b/i,
    /<object\b/i,
    /<embed\b/i,
    /<svg\b.*?on/i,
    /expression\s*\(/i,
    /url\s*\(\s*['"]?\s*javascript:/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(str));
}

/**
 * Escape HTML for safe display
 */
export { escapeHtml };
