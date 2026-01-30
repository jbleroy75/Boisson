'use client';

import { motion } from 'framer-motion';
import type { LoyaltyTier } from '@/types';
import { LOYALTY_TIERS } from '@/types';

interface LoyaltyCardProps {
  points: number;
  tier: LoyaltyTier;
  memberName: string;
  memberSince: string;
}

const TIER_COLORS: Record<LoyaltyTier, { bg: string; accent: string; text: string }> = {
  bronze: { bg: 'from-amber-600 to-amber-800', accent: '#CD7F32', text: 'text-amber-100' },
  silver: { bg: 'from-gray-400 to-gray-600', accent: '#C0C0C0', text: 'text-gray-100' },
  gold: { bg: 'from-yellow-400 to-yellow-600', accent: '#FFD700', text: 'text-yellow-100' },
  platinum: { bg: 'from-slate-700 to-slate-900', accent: '#E5E4E2', text: 'text-slate-100' },
};

const TIER_ICONS: Record<LoyaltyTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

export default function LoyaltyCard({ points, tier, memberName, memberSince }: LoyaltyCardProps) {
  const colors = TIER_COLORS[tier];
  const tierInfo = LOYALTY_TIERS[tier];
  const nextTier = getNextTier(tier);
  const nextTierInfo = nextTier ? LOYALTY_TIERS[nextTier] : null;
  const progress = nextTierInfo
    ? ((points - tierInfo.minPoints) / (nextTierInfo.minPoints - tierInfo.minPoints)) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} p-6 text-white shadow-2xl`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-2xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm opacity-80 mb-1">Membre Tamarque</div>
            <div className="text-2xl font-bold">{memberName}</div>
          </div>
          <div className="text-4xl">{TIER_ICONS[tier]}</div>
        </div>

        {/* Points */}
        <div className="mb-6">
          <div className="text-sm opacity-80 mb-1">Tes points</div>
          <div className="text-4xl font-bold">{points.toLocaleString()}</div>
        </div>

        {/* Progress to next tier */}
        {nextTierInfo && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="capitalize">{tier}</span>
              <span className="capitalize">{nextTier}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="text-xs opacity-80 mt-1">
              {nextTierInfo.minPoints - points} points pour atteindre {nextTier}
            </div>
          </div>
        )}

        {/* Multiplier Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
          <span className="text-sm">Multiplicateur:</span>
          <span className="font-bold">x{tierInfo.multiplier}</span>
        </div>

        {/* Member Since */}
        <div className="absolute bottom-6 right-6 text-xs opacity-60">
          Membre depuis {memberSince}
        </div>
      </div>
    </motion.div>
  );
}

function getNextTier(current: LoyaltyTier): LoyaltyTier | null {
  const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = tiers.indexOf(current);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}
