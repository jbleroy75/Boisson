'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoyaltyCard from '@/components/loyalty/LoyaltyCard';
import RewardsGrid from '@/components/loyalty/RewardsGrid';
import { motion } from 'framer-motion';
import { LOYALTY_TIERS } from '@/types';
import type { LoyaltyTier, LoyaltyReward } from '@/types';

// Mock user data (will come from auth/API)
const MOCK_USER = {
  name: 'Marie D.',
  points: 750,
  tier: 'silver' as LoyaltyTier,
  memberSince: 'Jan 2024',
};

export default function LoyaltyPage() {
  const [user] = useState(MOCK_USER);

  const handleRedeem = (reward: LoyaltyReward) => {
    console.log('Redeeming reward:', reward);
    // TODO: Implement redemption logic
  };

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Programme <span className="text-gradient">Fidélité</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gagne des points à chaque achat et débloque des récompenses exclusives.
            </p>
          </div>

          {/* Loyalty Card */}
          <div className="max-w-md mx-auto mb-12">
            <LoyaltyCard
              points={user.points}
              tier={user.tier}
              memberName={user.name}
              memberSince={user.memberSince}
            />
          </div>

          {/* Tiers Explanation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Les niveaux du programme</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {(Object.entries(LOYALTY_TIERS) as [LoyaltyTier, typeof LOYALTY_TIERS[LoyaltyTier]][]).map(
                ([tier, info], index) => {
                  const isCurrentTier = tier === user.tier;
                  const tierEmojis = { bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎' };

                  return (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                        isCurrentTier
                          ? 'border-[#FF6B35] shadow-lg scale-105'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{tierEmojis[tier]}</div>
                      <h3 className="text-xl font-bold capitalize mb-1">{tier}</h3>
                      <div className="text-sm text-gray-500 mb-4">
                        {info.minPoints.toLocaleString()}+ points
                      </div>
                      <ul className="space-y-2">
                        {info.perks.map((perk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <svg
                              className="w-4 h-4 text-[#00D9A5] flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {perk}
                          </li>
                        ))}
                      </ul>
                      {isCurrentTier && (
                        <div className="mt-4 text-xs text-[#FF6B35] font-semibold">
                          ✓ Ton niveau actuel
                        </div>
                      )}
                    </motion.div>
                  );
                }
              )}
            </div>
          </section>

          {/* Rewards Catalog */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8">Récompenses disponibles</h2>
            <RewardsGrid userPoints={user.points} onRedeem={handleRedeem} />
          </section>

          {/* How it works */}
          <section className="mt-16 bg-white rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🛒
                </div>
                <h3 className="font-bold mb-2">1. Achète</h3>
                <p className="text-gray-600 text-sm">
                  Gagne 1 point par euro dépensé. Les multiplicateurs augmentent avec ton niveau.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00D9A5]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ⬆️
                </div>
                <h3 className="font-bold mb-2">2. Monte en niveau</h3>
                <p className="text-gray-600 text-sm">
                  Accumule des points pour débloquer des avantages permanents.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF1493]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🎁
                </div>
                <h3 className="font-bold mb-2">3. Échange</h3>
                <p className="text-gray-600 text-sm">
                  Utilise tes points pour des réductions, produits gratuits et expériences exclusives.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
