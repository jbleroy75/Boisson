import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { z } from 'zod';
import type { LoyaltyReward } from '@/types';

const redeemSchema = z.object({
  rewardId: z.string().min(1),
});

// Available rewards
const REWARDS: LoyaltyReward[] = [
  {
    id: '1',
    name: 'Livraison gratuite',
    description: 'Sur ta prochaine commande',
    pointsCost: 200,
    type: 'freeShipping',
    value: 5.99,
  },
  {
    id: '2',
    name: '-5€ de réduction',
    description: 'Sur ta prochaine commande (min. 25€)',
    pointsCost: 500,
    type: 'discount',
    value: 5,
  },
  {
    id: '3',
    name: 'Bouteille gratuite',
    description: 'Une bouteille de ton choix offerte',
    pointsCost: 400,
    type: 'freeProduct',
    value: 3.99,
  },
  {
    id: '4',
    name: '-10€ de réduction',
    description: 'Sur ta prochaine commande (min. 40€)',
    pointsCost: 900,
    type: 'discount',
    value: 10,
  },
  {
    id: '5',
    name: 'Pack découverte',
    description: '3 bouteilles de saveurs différentes',
    pointsCost: 1000,
    type: 'freeProduct',
    value: 11.97,
  },
  {
    id: '6',
    name: 'Accès VIP Event',
    description: 'Invitation à notre prochain événement',
    pointsCost: 2500,
    type: 'exclusive',
    value: 0,
  },
];

function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TAM-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId } = redeemSchema.parse(body);

    // Find the reward
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: 'Récompense non trouvée' }, { status: 404 });
    }

    const supabase = createServerSupabaseClient();

    // Get user's current points
    const { data: member, error: memberError } = await supabase
      .from('loyalty_members')
      .select('id, points')
      .eq('user_id', session.user.id)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: 'Compte fidélité non trouvé' }, { status: 404 });
    }

    // Check if user has enough points
    if (member.points < reward.pointsCost) {
      return NextResponse.json(
        {
          error: 'Points insuffisants',
          required: reward.pointsCost,
          current: member.points,
        },
        { status: 400 }
      );
    }

    // Generate unique redemption code
    const redemptionCode = generateRedemptionCode();

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('loyalty_redemptions')
      .insert({
        user_id: session.user.id,
        reward_id: reward.id,
        reward_name: reward.name,
        reward_type: reward.type,
        points_spent: reward.pointsCost,
        value: reward.value,
        code: redemptionCode,
        status: 'active',
        redeemed_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (redemptionError) {
      console.error('Error creating redemption:', redemptionError);
      return NextResponse.json({ error: 'Erreur lors de la rédemption' }, { status: 500 });
    }

    // Deduct points from user
    const { error: updateError } = await supabase
      .from('loyalty_members')
      .update({
        points: member.points - reward.pointsCost,
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('Error updating points:', updateError);
      // Rollback: delete redemption
      await supabase.from('loyalty_redemptions').delete().eq('id', redemption.id);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour des points' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Récompense échangée avec succès !',
      redemption: {
        id: redemption.id,
        code: redemptionCode,
        reward: reward.name,
        type: reward.type,
        value: reward.value,
        expiresAt: expiresAt.toISOString(),
      },
      newPoints: member.points - reward.pointsCost,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error redeeming reward:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
