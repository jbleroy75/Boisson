'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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
    redirect('/login');
  }

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Content de te revoir, {session.user.name || 'toi'} !</h1>
            <p className="text-gray-600">Gère tes commandes, abonnements et paramètres de compte.</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <ul className="space-y-2">
                  {[
                    { href: '/account', label: 'Tableau de bord', icon: '📊', active: true },
                    { href: '/account/orders', label: 'Historique commandes', icon: '📦' },
                    { href: '/account/subscription', label: 'Abonnement', icon: '🔄' },
                    { href: '/account/addresses', label: 'Adresses', icon: '📍' },
                    { href: '/account/preferences', label: 'Préférences', icon: '⚙️' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          item.active
                            ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <span>🚪</span>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </motion.nav>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-3 gap-4"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-gray-500 text-sm">Commandes totales</div>
                </div>
                <div className="bg-gradient-to-br from-[#00D9A5] to-[#00B589] rounded-2xl p-6 text-white">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="text-2xl font-bold">Actif</div>
                  <div className="text-white/80 text-sm">Abonnement Athlete</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold">45,60€</div>
                  <div className="text-gray-500 text-sm">Total économisé</div>
                </div>
              </motion.div>

              {/* Active Subscription */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Abonnement actif</h2>
                    <p className="text-gray-500 text-sm">Prochaine livraison : 15 février 2024</p>
                  </div>
                  <Link
                    href="/account/subscription"
                    className="text-[#FF6B35] text-sm font-semibold hover:underline"
                  >
                    Gérer
                  </Link>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00D9A5] to-[#00B589] rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">🏃</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Formule Athlete</div>
                    <div className="text-sm text-gray-500">24 bouteilles/mois • -20%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#FF6B35]">76,61€</div>
                    <div className="text-xs text-gray-500">/mois</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Sauter la prochaine livraison
                  </button>
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Modifier la fréquence
                  </button>
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Commandes récentes</h2>
                  <Link
                    href="/account/orders"
                    className="text-[#FF6B35] text-sm font-semibold hover:underline"
                  >
                    Voir tout
                  </Link>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'ORD-001',
                      date: '15 jan. 2024',
                      status: 'Livrée',
                      total: 76.61,
                      items: 24,
                    },
                    {
                      id: 'ORD-002',
                      date: '15 déc. 2023',
                      status: 'Livrée',
                      total: 76.61,
                      items: 24,
                    },
                    {
                      id: 'ORD-003',
                      date: '15 nov. 2023',
                      status: 'Livrée',
                      total: 76.61,
                      items: 24,
                    },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                          <span className="text-[#FF6B35]">📦</span>
                        </div>
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {order.date} • {order.items} articles
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{order.total.toFixed(2)}€</div>
                        <div className="text-xs text-[#00D9A5]">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-6">Informations du compte</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <div className="font-medium">{session.user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Nom</label>
                    <div className="font-medium">{session.user.name || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Type de compte</label>
                    <div className="font-medium capitalize">{session.user.role || 'Client'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Membre depuis</label>
                    <div className="font-medium">Janvier 2024</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
