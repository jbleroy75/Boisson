import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { LOYALTY_TIERS } from '@/types';
import type { LoyaltyTier } from '@/types';

function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= 5000) return 'platinum';
  if (points >= 1500) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
}

// GET - Fetch loyalty data for authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get or create loyalty member record
    let { data: member } = await supabase
      .from('loyalty_members')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!member) {
      // Create new loyalty member
      const { data: newMember, error: createError } = await supabase
        .from('loyalty_members')
        .insert({
          user_id: session.user.id,
          points: 0,
          total_spent: 0,
          orders_count: 0,
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating loyalty member:', createError);
        return NextResponse.json({ error: 'Failed to create loyalty account' }, { status: 500 });
      }

      member = newMember;
    }

    // Get user name
    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', session.user.id)
      .single();

    // Get redemption history
    const { data: redemptions } = await supabase
      .from('loyalty_redemptions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('redeemed_at', { ascending: false })
      .limit(10);

    const tier = getTierFromPoints(member.points);
    const tierInfo = LOYALTY_TIERS[tier];

    return NextResponse.json({
      member: {
        name: user?.name || 'Membre',
        points: member.points,
        tier,
        tierInfo,
        totalSpent: member.total_spent,
        ordersCount: member.orders_count,
        memberSince: new Date(member.joined_at).toLocaleDateString('fr-FR', {
          month: 'short',
          year: 'numeric',
        }),
      },
      redemptions: redemptions || [],
    });
  } catch (error) {
    console.error('Error fetching loyalty data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
