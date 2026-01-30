'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SUBSCRIPTION_TIERS, MOCK_PRODUCTS, FLAVOR_COLORS } from '@/lib/constants';

export default function SubscribePage() {
  const [selectedTier, setSelectedTier] = useState(SUBSCRIPTION_TIERS[1].id); // Default to Athlete
  const [flavorMix, setFlavorMix] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_PRODUCTS.map((p) => [p.slug, Math.ceil(24 / 5)])) // Even distribution
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)!;
  const totalBottles = Object.values(flavorMix).reduce((sum, qty) => sum + qty, 0);

  const updateFlavorMix = (slug: string, value: number) => {
    const newMix = { ...flavorMix, [slug]: value };
    setFlavorMix(newMix);
  };

  // Auto-balance to match tier bottles
  const autoBalance = () => {
    const perFlavor = Math.floor(currentTier.bottles / MOCK_PRODUCTS.length);
    const remainder = currentTier.bottles % MOCK_PRODUCTS.length;
    const newMix: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p, i) => {
      newMix[p.slug] = perFlavor + (i < remainder ? 1 : 0);
    });
    setFlavorMix(newMix);
  };

  // Handle subscription checkout
  const handleSubscribe = async () => {
    if (totalBottles !== currentTier.bottles) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId: selectedTier,
          flavorMix,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#00D9A5] to-[#00B589] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-6">
                Économise jusqu'à 25%
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Abonne-toi et ne sois plus jamais à court</h1>
              <p className="text-xl text-white/80">
                Reçois tes boissons protéinées préférées chaque mois. Livraison gratuite, annulation à tout moment,
                avantages exclusifs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {SUBSCRIPTION_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => {
                      setSelectedTier(tier.id);
                      // Reset flavor mix for new tier
                      const perFlavor = Math.floor(tier.bottles / MOCK_PRODUCTS.length);
                      const remainder = tier.bottles % MOCK_PRODUCTS.length;
                      const newMix: Record<string, number> = {};
                      MOCK_PRODUCTS.forEach((p, i) => {
                        newMix[p.slug] = perFlavor + (i < remainder ? 1 : 0);
                      });
                      setFlavorMix(newMix);
                    }}
                    className={`w-full text-left p-8 rounded-3xl transition-all ${
                      selectedTier === tier.id
                        ? 'bg-white shadow-xl ring-2 ring-[#00D9A5] scale-105'
                        : 'bg-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {tier.id === 'athlete' && (
                      <span className="inline-block px-3 py-1 bg-[#FF6B35] text-white text-xs font-semibold rounded-full mb-4">
                        Le plus populaire
                      </span>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-[#FF6B35]">
                        {tier.price.toFixed(2)}€
                      </span>
                      <span className="text-gray-500">/mois</span>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="px-2 py-1 bg-[#00D9A5]/10 text-[#00D9A5] rounded text-sm font-semibold">
                        -{tier.discount}%
                      </span>
                      <span className="text-gray-500 text-sm">{tier.bottles} bouteilles</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <svg
                            className="w-5 h-5 text-[#00D9A5]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Flavor Mix Customization */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Personnalise ton mix</h2>
              <p className="text-gray-600">
                Choisis combien de chaque saveur tu veux dans ta box {currentTier.name}.
              </p>
            </div>

            {/* Flavor Sliders */}
            <div className="space-y-6 mb-8">
              {MOCK_PRODUCTS.map((product) => (
                <div
                  key={product.slug}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: FLAVOR_COLORS[product.flavor] + '40' }}
                  >
                    <div
                      className="w-6 h-10 rounded"
                      style={{ backgroundColor: FLAVOR_COLORS[product.flavor] }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-[#FF6B35] font-bold">{flavorMix[product.slug]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={currentTier.bottles}
                      value={flavorMix[product.slug]}
                      onChange={(e) => updateFlavorMix(product.slug, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Actions */}
            <div className="flex items-center justify-between p-6 bg-gray-100 rounded-2xl mb-8">
              <div>
                <div className="text-sm text-gray-500">Bouteilles sélectionnées</div>
                <div
                  className={`text-2xl font-bold ${
                    totalBottles === currentTier.bottles ? 'text-[#00D9A5]' : 'text-[#FF6B35]'
                  }`}
                >
                  {totalBottles} / {currentTier.bottles}
                </div>
              </div>
              <button
                onClick={autoBalance}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Équilibrer auto
              </button>
            </div>

            {totalBottles !== currentTier.bottles && (
              <p className="text-center text-[#FF6B35] mb-8">
                Sélectionne exactement {currentTier.bottles} bouteilles pour continuer.
              </p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Subscribe Button */}
            <button
              disabled={totalBottles !== currentTier.bottles || isLoading}
              onClick={handleSubscribe}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                totalBottles === currentTier.bottles && !isLoading
                  ? 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Redirection vers le paiement...
                </span>
              ) : (
                `S'abonner - ${currentTier.price.toFixed(2)}€/mois`
              )}
            </button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Les avantages de l'abonnement</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: '📦',
                  title: 'Livraison gratuite',
                  description: 'Chaque livraison est offerte, sans minimum.',
                },
                {
                  icon: '🔄',
                  title: 'Planning flexible',
                  description: 'Mets en pause, saute ou reprogramme depuis ton espace.',
                },
                {
                  icon: '🎁',
                  title: 'Avantages exclusifs',
                  description: 'Accès anticipé aux nouvelles saveurs et goodies réservés aux membres.',
                },
                {
                  icon: '❌',
                  title: 'Sans engagement',
                  description: 'Pas d\'engagement, pas de frais. Annule en un clic.',
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Comment fonctionne l\'abonnement ?',
                  a: "Choisis ta formule, personnalise ton mix de saveurs, et on te livre chaque mois. Tu peux mettre en pause, sauter ou annuler à tout moment.",
                },
                {
                  q: 'Je peux changer mes saveurs ?',
                  a: 'Bien sûr ! Connecte-toi à ton compte et modifie ton mix avant chaque cycle de facturation.',
                },
                {
                  q: 'Quand suis-je débité ?',
                  a: "Tu es débité à la souscription, puis à la même date chaque mois.",
                },
                {
                  q: 'Et si je veux annuler ?',
                  a: 'Pas de souci ! Annule quand tu veux depuis ton espace client. Sans frais, sans questions.',
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl">
                  <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
