'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RetoursPage() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Retours & Remboursements</h1>
              <p className="text-xl text-gray-600">
                Ta satisfaction est notre priorité. Découvre notre politique de retours simple et transparente.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Guarantee Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-[#00D9A5] to-[#00B589] text-white rounded-3xl p-8 mb-12 text-center"
            >
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold mb-2">Garantie Satisfait ou Remboursé 30 jours</h2>
              <p className="text-white/90">
                Si tu n'es pas satisfait de ta commande, on te rembourse sans poser de questions.
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Comment effectuer un retour ?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Contacte-nous',
                    description: 'Envoie un email à retours@tamarque.com avec ton numéro de commande.',
                    icon: '📧',
                  },
                  {
                    step: '2',
                    title: 'Reçois l\'étiquette',
                    description: 'On t\'envoie une étiquette de retour prépayée sous 24h.',
                    icon: '🏷️',
                  },
                  {
                    step: '3',
                    title: 'Sois remboursé',
                    description: 'Dès réception, tu es remboursé sous 5 jours ouvrés.',
                    icon: '💰',
                  },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                      {item.icon}
                    </div>
                    <div className="inline-block px-3 py-1 bg-[#FF6B35] text-white rounded-full text-sm font-bold mb-2">
                      Étape {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Policy Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Conditions de retour</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#00D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Délai de retour</h3>
                      <p className="text-gray-600">Tu disposes de 30 jours à compter de la réception pour retourner tes produits.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#00D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">État des produits</h3>
                      <p className="text-gray-600">Les bouteilles non ouvertes peuvent être retournées. Les produits endommagés ou défectueux sont remboursés intégralement.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#00D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Frais de retour</h3>
                      <p className="text-gray-600">Les frais de retour sont offerts pour les produits défectueux ou en cas d'erreur de notre part. Sinon, une étiquette prépayée à 4,90€ est déduite du remboursement.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#00D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Mode de remboursement</h3>
                      <p className="text-gray-600">Le remboursement est effectué sur le moyen de paiement utilisé lors de la commande, sous 5 jours ouvrés après réception du retour.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchanges */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Échanges</h2>
                <p className="text-gray-600 mb-4">
                  Tu préfères échanger plutôt que te faire rembourser ? Pas de problème !
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    Contacte-nous pour demander un échange de saveur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    Les frais de réexpédition sont offerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    Si le nouveau produit est plus cher, on te facture la différence
                  </li>
                </ul>
              </div>

              {/* Subscriptions */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Abonnements</h2>
                <p className="text-gray-600 mb-4">
                  Pour les commandes d'abonnement :
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    Tu peux annuler ton abonnement à tout moment depuis ton compte
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    Les livraisons déjà expédiées peuvent être retournées selon les conditions ci-dessus
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FF6B35]">•</span>
                    En cas d'annulation, les livraisons futures sont automatiquement annulées
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-[#1A1A1A] text-white rounded-2xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Une question sur un retour ?</h2>
              <p className="text-gray-300 mb-6">
                Notre équipe est disponible du lundi au vendredi de 9h à 18h pour t'aider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors"
                >
                  Nous contacter
                </Link>
                <a
                  href="mailto:retours@tamarque.com"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  retours@tamarque.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
