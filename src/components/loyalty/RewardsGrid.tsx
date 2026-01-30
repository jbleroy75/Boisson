'use client';

import { motion } from 'framer-motion';
import type { LoyaltyReward } from '@/types';

const MOCK_REWARDS: LoyaltyReward[] = [
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

const REWARD_ICONS: Record<string, string> = {
  freeShipping: '🚚',
  discount: '💰',
  freeProduct: '🎁',
  exclusive: '⭐',
};

interface RewardsGridProps {
  userPoints: number;
  onRedeem?: (reward: LoyaltyReward) => void;
}

export default function RewardsGrid({ userPoints, onRedeem }: RewardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_REWARDS.map((reward, index) => {
        const canRedeem = userPoints >= reward.pointsCost;

        return (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
              canRedeem
                ? 'border-[#FF6B35] hover:shadow-lg hover:-translate-y-1'
                : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Icon */}
            <div className="text-4xl mb-4">{REWARD_ICONS[reward.type]}</div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

            {/* Points Cost */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#FF6B35]">
                  {reward.pointsCost.toLocaleString()}
                </span>
                <span className="text-gray-500">pts</span>
              </div>

              <button
                onClick={() => onRedeem?.(reward)}
                disabled={!canRedeem}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  canRedeem
                    ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2a]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canRedeem ? 'Échanger' : 'Insuffisant'}
              </button>
            </div>

            {/* Progress indicator */}
            {!canRedeem && (
              <div className="mt-4">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B35] rounded-full"
                    style={{ width: `${(userPoints / reward.pointsCost) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Il te manque {reward.pointsCost - userPoints} points
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
