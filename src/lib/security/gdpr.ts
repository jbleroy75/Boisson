/**
 * GDPR Compliance Utilities
 * Handles data export, deletion, and consent management
 */

import { createServerSupabaseClient } from '../supabase';
import { logGdprEvent } from './audit';

export interface UserData {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    created_at: string;
    last_login: string | null;
  };
  orders?: Array<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    items: unknown;
  }>;
  subscriptions?: Array<{
    id: string;
    tier_id: string;
    status: string;
    created_at: string;
  }>;
  loyaltyPoints?: {
    points: number;
    lifetime_points: number;
    tier: string;
  };
  loyaltyTransactions?: Array<{
    id: string;
    points: number;
    type: string;
    description: string | null;
    created_at: string;
  }>;
  consents?: Array<{
    id: string;
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    created_at: string;
  }>;
}

/**
 * Export all user data (GDPR Right to Access)
 */
export async function exportUserData(userId: string): Promise<UserData | null> {
  const supabase = createServerSupabaseClient();

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, name, role, created_at, last_login')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    console.error('Error fetching user for GDPR export:', userError);
    return null;
  }

  // Get B2B orders if user is a distributor
  const { data: distributor } = await supabase
    .from('distributors')
    .select('id')
    .eq('user_id', userId)
    .single();

  let orders: UserData['orders'] = [];
  if (distributor) {
    const { data: orderData } = await supabase
      .from('b2b_orders')
      .select('id, total, status, created_at, items')
      .eq('distributor_id', distributor.id)
      .order('created_at', { ascending: false });

    orders = orderData || [];
  }

  // Get subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, tier_id, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Get loyalty points
  const { data: loyaltyPoints } = await supabase
    .from('loyalty_points')
    .select('points, lifetime_points, tier')
    .eq('user_id', userId)
    .single();

  // Get loyalty transactions
  const { data: loyaltyTransactions } = await supabase
    .from('loyalty_transactions')
    .select('id, points, type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Get consent records
  const { data: consents } = await supabase
    .from('cookie_consents')
    .select('id, necessary, analytics, marketing, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return {
    user,
    orders,
    subscriptions: subscriptions || [],
    loyaltyPoints: loyaltyPoints || undefined,
    loyaltyTransactions: loyaltyTransactions || [],
    consents: consents || [],
  };
}

/**
 * Delete all user data (GDPR Right to Erasure)
 * This is a soft delete - anonymizes data rather than full deletion
 * to maintain referential integrity and business records
 */
export async function deleteUserData(
  userId: string,
  request: Request
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient();

  try {
    // Get user email for logging before deletion
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    // Anonymize user data
    const anonymizedEmail = `deleted_${userId}@deleted.tamarque.com`;
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email: anonymizedEmail,
        name: 'Compte supprimé',
        password_hash: null,
        two_factor_secret: null,
        two_factor_enabled: false,
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Failed to anonymize user: ${updateError.message}`);
    }

    // Delete sensitive data
    await Promise.all([
      // Delete password reset tokens
      supabase.from('password_reset_tokens').delete().eq('user_id', userId),

      // Delete active sessions
      supabase.from('user_sessions').delete().eq('user_id', userId),

      // Delete cookie consents
      supabase.from('cookie_consents').delete().eq('user_id', userId),

      // Anonymize audit logs (keep for compliance but remove PII)
      supabase
        .from('audit_logs')
        .update({ email: null })
        .eq('user_id', userId),
    ]);

    // Log the deletion
    await logGdprEvent('gdpr:data_deleted', request, userId, {
      originalEmail: user?.email,
      deletedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting user data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a GDPR request record
 */
export async function createGdprRequest(
  userId: string,
  email: string,
  type: 'export' | 'delete',
  reason?: string
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('gdpr_requests')
    .insert({
      user_id: userId,
      email,
      request_type: type,
      reason,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, requestId: data.id };
}

/**
 * Update GDPR request status
 */
export async function updateGdprRequestStatus(
  requestId: string,
  status: 'processing' | 'completed' | 'failed'
): Promise<void> {
  const supabase = createServerSupabaseClient();

  await supabase
    .from('gdpr_requests')
    .update({
      status,
      ...(status === 'completed' && { completed_at: new Date().toISOString() }),
    })
    .eq('id', requestId);
}

/**
 * Record cookie consent
 */
export async function recordCookieConsent(
  consent: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  },
  userId?: string,
  anonymousId?: string,
  ipAddress?: string
): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  // Check for existing consent record
  let existingId: string | null = null;

  if (userId) {
    const { data: existing } = await supabase
      .from('cookie_consents')
      .select('id')
      .eq('user_id', userId)
      .single();

    existingId = existing?.id;
  } else if (anonymousId) {
    const { data: existing } = await supabase
      .from('cookie_consents')
      .select('id')
      .eq('anonymous_id', anonymousId)
      .single();

    existingId = existing?.id;
  }

  if (existingId) {
    // Update existing
    await supabase
      .from('cookie_consents')
      .update({
        ...consent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingId);
  } else {
    // Insert new
    await supabase.from('cookie_consents').insert({
      user_id: userId,
      anonymous_id: anonymousId,
      ip_address: ipAddress,
      ...consent,
    });
  }

  return { success: true };
}

/**
 * Get user's current cookie consent
 */
export async function getCookieConsent(
  userId?: string,
  anonymousId?: string
): Promise<{
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
} | null> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('cookie_consents')
    .select('necessary, analytics, marketing')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (anonymousId) {
    query = query.eq('anonymous_id', anonymousId);
  } else {
    return null;
  }

  const { data } = await query.single();
  return data;
}

/**
 * Generate data export as JSON file content
 */
export function formatDataExport(data: UserData): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      exportFormat: 'JSON',
      dataController: {
        name: 'Tamarque SAS',
        email: 'privacy@tamarque.com',
        address: 'France',
      },
      data,
    },
    null,
    2
  );
}
