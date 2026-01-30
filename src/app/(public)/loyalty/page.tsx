'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoyaltyCard from '@/components/loyalty/LoyaltyCard';
import RewardsGrid from '@/components/loyalty/RewardsGrid';
import { motion } from 'framer-motion';
import { LOYALTY_TIERS } from '@/types';
import type { LoyaltyTier, LoyaltyReward } from '@/types';

interface LoyaltyMemberData {
  name: string;
  points: number;
  tier: LoyaltyTier;
  memberSince: string;
}

interface RedemptionResult {
  success: boolean;
  code?: string;
  reward?: string;
  expiresAt?: string;
  newPoints?: number;
  error?: string;
}

export default function LoyaltyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [member, setMember] = useState<LoyaltyMemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);

  useEffect(() => {
    async function fetchLoyaltyData() {
      if (status === 'loading') return;

      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/loyalty');
        if (response.ok) {
          const data = await response.json();
          setMember(data.member);
        }
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLoyaltyData();
  }, [session, status]);

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (!session) {
      router.push('/login?redirect=/loyalty');
      return;
    }

    setRedeeming(reward.id);
    setRedemptionResult(null);

    try {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setRedemptionResult({
          success: true,
          code: data.redemption.code,
          reward: data.redemption.reward,
          expiresAt: data.redemption.expiresAt,
          newPoints: data.newPoints,
        });
        // Update local points
        if (member) {
          setMember({ ...member, points: data.newPoints });
        }
      } else {
        setRedemptionResult({
          success: false,
          error: data.error || 'Une erreur est survenue',
        });
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      setRedemptionResult({
        success: false,
        error: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setRedeeming(null);
    }
  };

  const closeModal = () => {
    setRedemptionResult(null);
  };

  // Show login prompt for non-authenticated users
  const showLoginPrompt = !session && !loading;

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

          {/* Login prompt for non-authenticated users */}
          {showLoginPrompt && (
            <div className="max-w-md mx-auto mb-12 bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold mb-4">Rejoins le programme !</h2>
              <p className="text-gray-600 mb-6">
                Connecte-toi pour accéder à tes points et échanger des récompenses.
              </p>
              <button
                onClick={() => router.push('/login?redirect=/loyalty')}
                className="w-full bg-[#FF6B35] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#e55a2a] transition-colors"
              >
                Se connecter
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => router.push('/register?redirect=/loyalty')}
                  className="text-[#FF6B35] hover:underline"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="max-w-md mx-auto mb-12">
              <div className="bg-white rounded-2xl p-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          )}

          {/* Loyalty Card for authenticated users */}
          {member && (
            <div className="max-w-md mx-auto mb-12">
              <LoyaltyCard
                points={member.points}
                tier={member.tier}
                memberName={member.name}
                memberSince={member.memberSince}
              />
            </div>
          )}

          {/* Tiers Explanation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Les niveaux du programme</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {(Object.entries(LOYALTY_TIERS) as [LoyaltyTier, typeof LOYALTY_TIERS[LoyaltyTier]][]).map(
                ([tier, info], index) => {
                  const isCurrentTier = member?.tier === tier;
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
            <RewardsGrid
              userPoints={member?.points ?? 0}
              onRedeem={handleRedeem}
              redeemingId={redeeming}
              isAuthenticated={!!session}
            />
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

      {/* Redemption Result Modal */}
      {redemptionResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {redemptionResult.success ? (
              <>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">Félicitations !</h3>
                  <p className="text-gray-600 mb-6">
                    Tu as échangé : <strong>{redemptionResult.reward}</strong>
                  </p>
                  <div className="bg-gray-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Ton code :</p>
                    <p className="text-2xl font-mono font-bold text-[#FF6B35]">
                      {redemptionResult.code}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Valable jusqu&apos;au{' '}
                      {new Date(redemptionResult.expiresAt!).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Utilise ce code lors de ton prochain achat. Tu as maintenant{' '}
                    <strong>{redemptionResult.newPoints?.toLocaleString()}</strong> points.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-2xl font-bold mb-2">Oups !</h3>
                  <p className="text-gray-600 mb-6">{redemptionResult.error}</p>
                </div>
              </>
            )}
            <button
              onClick={closeModal}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2a] transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}
