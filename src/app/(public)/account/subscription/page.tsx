'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS } from '@/lib/constants';

interface Subscription {
  id: string;
  plan: 'starter' | 'athlete' | 'team';
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string;
  frequency: 'monthly' | 'biweekly';
  items: { productId: string; quantity: number }[];
  discount: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

// Mock subscription data
const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub_abc123',
  plan: 'athlete',
  status: 'active',
  nextDelivery: '2024-02-15',
  frequency: 'monthly',
  items: [
    { productId: '1', quantity: 12 },
    { productId: '3', quantity: 6 },
    { productId: '5', quantity: 6 },
  ],
  discount: 20,
  total: 76.61,
  paymentMethod: 'Visa •••• 4242',
  createdAt: '2023-11-01',
};

const PLAN_NAMES = {
  starter: 'Starter',
  athlete: 'Athlète',
  team: 'Team',
};

export default function SubscriptionManagementPage() {
  const { data: session, status: authStatus } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(MOCK_SUBSCRIPTION);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (authStatus === 'loading') {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    redirect('/login?callbackUrl=/account/subscription');
  }

  const handlePauseSubscription = async () => {
    setIsLoading(true);
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscription((prev) => (prev ? { ...prev, status: 'paused' } : null));
    setShowPauseModal(false);
    setIsLoading(false);
  };

  const handleResumeSubscription = async () => {
    setIsLoading(true);
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscription((prev) => (prev ? { ...prev, status: 'active' } : null));
    setIsLoading(false);
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscription((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
    setShowCancelModal(false);
    setIsLoading(false);
  };

  // No subscription
  if (!subscription || subscription.status === 'cancelled') {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/account" className="hover:text-[#FF6B35]">
                Mon compte
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Abonnement</span>
            </nav>

            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-6">📦</div>
              <h1 className="text-3xl font-bold mb-4">
                {subscription?.status === 'cancelled'
                  ? 'Ton abonnement a été annulé'
                  : 'Tu n\'as pas d\'abonnement actif'}
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Abonne-toi pour recevoir tes boissons protéinées préférées chaque mois et économise jusqu'à 25% !
              </p>
              <Link
                href="/subscribe"
                className="inline-block bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition-colors"
              >
                Découvrir les abonnements
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const subscriptionItems = subscription.items.map((item) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const totalBottles = subscription.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/account" className="hover:text-[#FF6B35]">
              Mon compte
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Abonnement</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon abonnement</h1>
              <p className="text-gray-600">Gère ton abonnement et tes livraisons</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                subscription.status === 'active'
                  ? 'bg-[#00D9A5]/10 text-[#00D9A5]'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {subscription.status === 'active' ? '✓ Actif' : '⏸ En pause'}
            </span>
          </motion.div>

          {/* Paused Banner */}
          {subscription.status === 'paused' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-yellow-800 mb-1">Ton abonnement est en pause</h2>
                  <p className="text-yellow-700 text-sm">
                    Tu ne recevras pas de livraisons tant que tu n'auras pas repris ton abonnement.
                  </p>
                </div>
                <button
                  onClick={handleResumeSubscription}
                  disabled={isLoading}
                  className="bg-yellow-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Chargement...' : 'Reprendre l\'abonnement'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Next Delivery */}
          {subscription.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Prochaine livraison</p>
                  <p className="text-2xl font-bold">
                    {new Date(subscription.nextDelivery).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button className="bg-white/20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                  Modifier la date
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Plan */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Formule {PLAN_NAMES[subscription.plan]}</h2>
                  <Link href="/subscribe" className="text-[#FF6B35] font-semibold hover:underline text-sm">
                    Changer de formule
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#FF6B35]">{totalBottles}</div>
                    <div className="text-sm text-gray-500">bouteilles/mois</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#00D9A5]">-{subscription.discount}%</div>
                    <div className="text-sm text-gray-500">de réduction</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-2xl font-bold">{subscription.total.toFixed(2)}€</div>
                    <div className="text-sm text-gray-500">par mois</div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mes saveurs</h2>
                  <button className="text-[#FF6B35] font-semibold hover:underline text-sm">
                    Modifier les saveurs
                  </button>
                </div>
                <div className="space-y-4">
                  {subscriptionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 rounded-xl flex items-center justify-center">
                          <div className="w-4 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.product?.name || 'Produit'}</p>
                          <p className="text-sm text-gray-500">{item.quantity} bouteilles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center hover:bg-[#E55A2B] transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold mb-4">Moyen de paiement</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <span className="text-gray-600">{subscription.paymentMethod}</span>
                </div>
                <button className="text-[#FF6B35] text-sm font-semibold hover:underline">
                  Modifier le moyen de paiement
                </button>
              </div>

              {/* Frequency */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold mb-4">Fréquence de livraison</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="frequency"
                      checked={subscription.frequency === 'monthly'}
                      onChange={() => {}}
                      className="text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <span>Tous les mois</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="frequency"
                      checked={subscription.frequency === 'biweekly'}
                      onChange={() => {}}
                      className="text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <span>Toutes les 2 semaines</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                {subscription.status === 'active' && (
                  <button
                    onClick={() => setShowPauseModal(true)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Mettre en pause
                  </button>
                )}
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-3 text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
                >
                  Annuler l'abonnement
                </button>
              </div>

              {/* Member Since */}
              <div className="text-center text-sm text-gray-500">
                Membre depuis{' '}
                {new Date(subscription.createdAt).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </motion.div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Link href="/account" className="text-[#FF6B35] font-semibold hover:underline">
              ← Retour à mon compte
            </Link>
          </div>
        </div>

        {/* Pause Modal */}
        {showPauseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⏸</div>
                <h2 className="text-2xl font-bold mb-2">Mettre en pause ?</h2>
                <p className="text-gray-600">
                  Tu peux reprendre ton abonnement à tout moment. Tes préférences seront sauvegardées.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handlePauseSubscription}
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] text-white py-3 rounded-xl font-semibold hover:bg-[#E55A2B] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Chargement...' : 'Confirmer la pause'}
                </button>
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="w-full border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">😢</div>
                <h2 className="text-2xl font-bold mb-2">Tu nous quittes ?</h2>
                <p className="text-gray-600">
                  On est triste de te voir partir ! Tu perdras ta réduction de {subscription.discount}% et tes avantages.
                </p>
              </div>
              <div className="bg-[#00D9A5]/10 rounded-xl p-4 mb-6">
                <p className="text-sm text-center">
                  <strong>Alternative :</strong> Tu peux mettre en pause ton abonnement plutôt que de l'annuler.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setShowPauseModal(true);
                  }}
                  className="w-full bg-[#FF6B35] text-white py-3 rounded-xl font-semibold hover:bg-[#E55A2B] transition-colors"
                >
                  Mettre en pause plutôt
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="w-full border border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Chargement...' : 'Annuler définitivement'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full text-gray-500 py-2 font-medium hover:text-gray-700 transition-colors"
                >
                  Revenir en arrière
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
