'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In production, this would call the API
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setIsSubmitted(true);
    } catch (err) {
      // For demo, always show success to prevent email enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <span className="text-3xl font-bold">
                  TAMAR<span className="text-[#FF6B35]">QUE</span>
                </span>
              </Link>
            </div>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    🔐
                  </div>
                  <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
                  <p className="text-gray-500 mt-2">
                    Pas de panique ! Entre ton email et on t'envoie un lien pour réinitialiser ton mot de passe.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      placeholder="toi@exemple.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF6B35] text-white py-3 rounded-xl font-semibold hover:bg-[#E55A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-[#FF6B35] font-semibold hover:underline">
                    ← Retour à la connexion
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00D9A5]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✉️
                </div>
                <h1 className="text-2xl font-bold mb-2">Email envoyé !</h1>
                <p className="text-gray-500 mb-6">
                  Si un compte existe avec l'adresse <strong>{email}</strong>, tu recevras un email avec les instructions pour réinitialiser ton mot de passe.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  L'email peut prendre quelques minutes à arriver. Pense à vérifier tes spams.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Renvoyer l'email
                  </button>
                  <Link
                    href="/login"
                    className="block w-full bg-[#FF6B35] text-white py-3 rounded-xl font-semibold hover:bg-[#E55A2B] transition-colors text-center"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Tu n'as pas reçu l'email ?{' '}
            <Link href="/contact" className="text-[#FF6B35] hover:underline">
              Contacte notre support
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
