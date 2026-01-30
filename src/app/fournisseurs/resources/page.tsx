'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function B2BResourcesPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <>
        <Header isB2B />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer isB2B />
      </>
    );
  }

  const isLoggedIn = !!session;

  const resources = [
    {
      category: 'Catalogue Produits',
      items: [
        { name: 'Catalogue complet 2024', type: 'PDF', size: '4.2 Mo', restricted: false },
        { name: 'Fiches nutritionnelles', type: 'PDF', size: '1.1 Mo', restricted: false },
        { name: 'Spécifications ingrédients', type: 'PDF', size: '2.3 Mo', restricted: true },
      ],
    },
    {
      category: 'Assets Marketing',
      items: [
        { name: 'Photos produits (Haute résolution)', type: 'ZIP', size: '156 Mo', restricted: true },
        { name: 'Pack Logo (Tous formats)', type: 'ZIP', size: '8.4 Mo', restricted: true },
        { name: 'Templates réseaux sociaux', type: 'ZIP', size: '24 Mo', restricted: true },
        { name: 'PLV et displays', type: 'PDF', size: '12 Mo', restricted: true },
      ],
    },
    {
      category: 'Supports de vente',
      items: [
        { name: 'Présentation commerciale', type: 'PPTX', size: '18 Mo', restricted: true },
        { name: 'Fiches produits', type: 'PDF', size: '3.5 Mo', restricted: false },
        { name: 'Témoignages clients', type: 'ZIP', size: '45 Mo', restricted: true },
      ],
    },
    {
      category: 'Formation',
      items: [
        { name: 'Vidéo de formation produit', type: 'MP4', size: '320 Mo', restricted: true },
        { name: 'Document FAQ', type: 'PDF', size: '0.8 Mo', restricted: false },
        { name: 'Charte graphique', type: 'PDF', size: '5.2 Mo', restricted: true },
      ],
    },
  ];

  return (
    <>
      <Header isB2B />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Ressources distributeur</h1>
            <p className="text-gray-600">
              Téléchargez catalogues produits, assets marketing et supports de vente.
            </p>
          </motion.div>

          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Certaines ressources nécessitent une connexion
                  </h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Connectez-vous avec votre compte distributeur pour accéder à toutes les
                    ressources dont les assets haute résolution et le matériel marketing.
                  </p>
                  <Link
                    href="/login?callbackUrl=/fournisseurs/resources"
                    className="inline-block bg-yellow-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-900 transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (categoryIndex + 1) }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b bg-gray-50">
                  <h2 className="text-lg font-bold">{category.category}</h2>
                </div>
                <div className="divide-y">
                  {category.items.map((item, itemIndex) => {
                    const canDownload = !item.restricted || isLoggedIn;
                    return (
                      <div
                        key={itemIndex}
                        className={`p-4 flex items-center justify-between ${
                          !canDownload ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              item.type === 'PDF'
                                ? 'bg-red-100 text-red-600'
                                : item.type === 'ZIP'
                                ? 'bg-purple-100 text-purple-600'
                                : item.type === 'PPTX'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <span className="text-xs font-bold">{item.type}</span>
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.size}</div>
                          </div>
                        </div>
                        {canDownload ? (
                          <button
                            onClick={() => alert(`Téléchargement : ${item.name}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/20 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Télécharger
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Connexion requise
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Request Custom Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-br from-[#1A1A1A] to-[#333] text-white rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Besoin d'assets personnalisés ?</h2>
                <p className="text-gray-300">
                  Notre équipe marketing peut créer des supports co-brandés adaptés à votre activité.
                </p>
              </div>
              <Link
                href="/fournisseurs/contact"
                className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors whitespace-nowrap"
              >
                Demander des assets personnalisés
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
