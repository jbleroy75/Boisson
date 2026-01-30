/**
 * Audit Logging System
 * Tracks security-relevant events for compliance and debugging
 */

import { createServerSupabaseClient } from '../supabase';

export type AuditAction =
  | 'auth:login_success'
  | 'auth:login_failed'
  | 'auth:logout'
  | 'auth:password_change'
  | 'auth:password_reset_request'
  | 'auth:password_reset_complete'
  | 'auth:account_locked'
  | 'auth:2fa_enabled'
  | 'auth:2fa_disabled'
  | 'user:created'
  | 'user:updated'
  | 'user:deleted'
  | 'user:data_export'
  | 'order:created'
  | 'order:updated'
  | 'order:cancelled'
  | 'payment:success'
  | 'payment:failed'
  | 'payment:refund'
  | 'subscription:created'
  | 'subscription:cancelled'
  | 'subscription:updated'
  | 'b2b:registration'
  | 'b2b:approved'
  | 'b2b:rejected'
  | 'b2b:order_created'
  | 'admin:user_modified'
  | 'admin:settings_changed'
  | 'security:rate_limit_exceeded'
  | 'security:suspicious_activity'
  | 'security:csrf_failed'
  | 'security:invalid_signature'
  | 'gdpr:consent_given'
  | 'gdpr:consent_withdrawn'
  | 'gdpr:data_deleted';

export interface AuditLogEntry {
  action: AuditAction;
  userId?: string;
  email?: string;
  ipAddress: string;
  userAgent: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', JSON.stringify(logEntry, null, 2));
  }

  // Store in database
  try {
    const supabase = createServerSupabaseClient();
    await supabase.from('audit_logs').insert({
      action: logEntry.action,
      user_id: logEntry.userId,
      email: logEntry.email,
      ip_address: logEntry.ipAddress,
      user_agent: logEntry.userAgent,
      resource: logEntry.resource,
      resource_id: logEntry.resourceId,
      details: logEntry.details,
      severity: logEntry.severity,
      created_at: logEntry.timestamp,
    });
  } catch (error) {
    // Don't throw - audit logging should not break the app
    console.error('[AUDIT] Failed to store audit log:', error);
  }

  // For critical events, could send alerts
  if (logEntry.severity === 'critical') {
    await sendSecurityAlert(logEntry);
  }
}

/**
 * Send security alert for critical events
 */
async function sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
  // In production, send to monitoring service (Sentry, PagerDuty, etc.)
  console.error('[SECURITY ALERT]', JSON.stringify(entry, null, 2));

  // Could also send email notification
  if (process.env.RESEND_API_KEY && process.env.SECURITY_ALERT_EMAIL) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Tamarque Security <security@tamarque.com>',
        to: [process.env.SECURITY_ALERT_EMAIL],
        subject: `[SECURITY ALERT] ${entry.action}`,
        html: `
          <h2>Security Alert - ${entry.action}</h2>
          <p><strong>Time:</strong> ${entry.timestamp}</p>
          <p><strong>Severity:</strong> ${entry.severity}</p>
          <p><strong>IP Address:</strong> ${entry.ipAddress}</p>
          <p><strong>User:</strong> ${entry.email || entry.userId || 'Anonymous'}</p>
          ${entry.resource ? `<p><strong>Resource:</strong> ${entry.resource} (${entry.resourceId})</p>` : ''}
          <hr />
          <pre>${JSON.stringify(entry.details, null, 2)}</pre>
        `,
      });
    } catch (error) {
      console.error('[AUDIT] Failed to send security alert email:', error);
    }
  }
}

/**
 * Helper to extract audit info from request
 */
export function getAuditContext(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const headers = new Headers(request.headers);

  // Get IP address
  let ipAddress = 'unknown';
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    ipAddress = forwarded.split(',')[0].trim();
  } else {
    const realIp = headers.get('x-real-ip');
    if (realIp) {
      ipAddress = realIp;
    }
  }

  // Get user agent
  const userAgent = headers.get('user-agent') || 'unknown';

  return { ipAddress, userAgent };
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  action: 'auth:login_success' | 'auth:login_failed' | 'auth:logout' | 'auth:account_locked',
  request: Request,
  email: string,
  userId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { ipAddress, userAgent } = getAuditContext(request);

  await logAuditEvent({
    action,
    userId,
    email,
    ipAddress,
    userAgent,
    severity: action === 'auth:login_success' || action === 'auth:logout' ? 'info' : 'warning',
    details,
  });
}

/**
 * Log rate limit events
 */
export async function logRateLimitExceeded(
  request: Request,
  endpoint: string,
  identifier: string
): Promise<void> {
  const { ipAddress, userAgent } = getAuditContext(request);

  await logAuditEvent({
    action: 'security:rate_limit_exceeded',
    ipAddress,
    userAgent,
    resource: endpoint,
    severity: 'warning',
    details: { identifier, endpoint },
  });
}

/**
 * Log GDPR events
 */
export async function logGdprEvent(
  action: 'gdpr:consent_given' | 'gdpr:consent_withdrawn' | 'gdpr:data_deleted',
  request: Request,
  userId: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { ipAddress, userAgent } = getAuditContext(request);

  await logAuditEvent({
    action,
    userId,
    ipAddress,
    userAgent,
    severity: 'info',
    details,
  });
}

/**
 * Query audit logs (admin only)
 */
export async function queryAuditLogs(filters: {
  userId?: string;
  action?: AuditAction;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLogEntry[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters.action) {
    query = query.eq('action', filters.action);
  }
  if (filters.severity) {
    query = query.eq('severity', filters.severity);
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  query = query.range(
    filters.offset || 0,
    (filters.offset || 0) + (filters.limit || 100) - 1
  );

  const { data, error } = await query;

  if (error) {
    console.error('[AUDIT] Failed to query audit logs:', error);
    return [];
  }

  return (data || []).map((row) => ({
    action: row.action as AuditAction,
    userId: row.user_id,
    email: row.email,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    resource: row.resource,
    resourceId: row.resource_id,
    details: row.details,
    severity: row.severity,
    timestamp: row.created_at,
  }));
}
