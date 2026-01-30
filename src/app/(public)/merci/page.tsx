'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-[#00D9A5] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">Merci !</h1>
            <p className="text-xl text-gray-600 mb-8">
              Ta commande a bien été reçue et est en cours de traitement.
            </p>

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">📧</div>
                  <h3 className="font-semibold mb-1">Email de confirmation</h3>
                  <p className="text-sm text-gray-600">
                    Un email de confirmation a été envoyé dans ta boîte mail.
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📦</div>
                  <h3 className="font-semibold mb-1">Expédition</h3>
                  <p className="text-sm text-gray-600">
                    Ta commande sera expédiée sous 1-2 jours ouvrés.
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔔</div>
                  <h3 className="font-semibold mb-1">Suivi</h3>
                  <p className="text-sm text-gray-600">
                    Tu recevras les infos de suivi dès l'expédition.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-br from-[#FF6B35]/10 to-[#FF1493]/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Et maintenant ?</h2>
              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Vérifie ta boîte mail pour la confirmation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>On prépare ta commande avec soin</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Tu reçois le numéro de suivi par email</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Profite de tes boissons Tamarque !</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#FF6B35] text-white rounded-xl font-semibold hover:bg-[#E55A2B] transition-colors"
              >
                Continuer mes achats
              </Link>
              <Link
                href="/account"
                className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Voir mes commandes
              </Link>
            </div>

            {/* Social Share */}
            <div className="mt-12">
              <p className="text-gray-500 mb-4">Partage ton achat avec tes amis !</p>
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
