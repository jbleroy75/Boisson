'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, MailX, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error' | 'invalid'>(
    token ? 'loading' : 'confirm'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [inputEmail, setInputEmail] = useState(email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If token is provided, auto-unsubscribe
  useEffect(() => {
    if (token && email) {
      handleUnsubscribe(email, token);
    } else if (token && !email) {
      setStatus('invalid');
      setErrorMessage('Lien de désinscription invalide. Email manquant.');
    } else {
      setStatus('confirm');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  const handleUnsubscribe = async (emailToUnsubscribe: string, unsubToken?: string) => {
    setIsSubmitting(true);
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUnsubscribe,
          token: unsubToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setStatus('error');
          setErrorMessage("Cette adresse email n'est pas inscrite à notre newsletter.");
        } else if (response.status === 401) {
          setStatus('invalid');
          setErrorMessage('Lien de désinscription invalide ou expiré.');
        } else {
          throw new Error(data.error || 'Erreur lors de la désinscription');
        }
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail) {
      handleUnsubscribe(inputEmail);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            {/* Loading state */}
            {status === 'loading' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Désinscription en cours...
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Veuillez patienter quelques instants.
                </p>
              </div>
            )}

            {/* Confirmation form (manual unsubscribe) */}
            {status === 'confirm' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailX className="h-8 w-8 text-orange-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Se désinscrire
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Vous ne souhaitez plus recevoir nos emails ? Entrez votre adresse email
                    ci-dessous.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !inputEmail}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Désinscription...
                      </>
                    ) : (
                      'Me désinscrire'
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Vous continuerez à recevoir les emails transactionnels importants
                    (confirmations de commande, mises à jour de compte, etc.)
                  </p>
                </div>
              </>
            )}

            {/* Success state */}
            {status === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Désinscription réussie
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Vous avez été désinscrit de notre newsletter. Vous ne recevrez plus nos
                  emails promotionnels.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-900 dark:text-white">Vous nous manquez déjà !</strong>
                      <br />
                      Si vous changez d'avis, vous pouvez vous réinscrire à tout moment sur
                      notre site.
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Erreur
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

                <div className="space-y-3">
                  <button
                    onClick={() => setStatus('confirm')}
                    className="w-full btn-primary py-3"
                  >
                    Réessayer
                  </button>
                  <Link
                    href="/"
                    className="block text-center text-gray-600 dark:text-gray-400 hover:text-orange-500"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}

            {/* Invalid token state */}
            {status === 'invalid' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Lien invalide
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setStatus('confirm');
                      setInputEmail('');
                    }}
                    className="w-full btn-primary py-3"
                  >
                    Se désinscrire manuellement
                  </button>
                  <Link
                    href="/"
                    className="block text-center text-gray-600 dark:text-gray-400 hover:text-orange-500"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Préférences alternatives
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Au lieu de vous désinscrire complètement, vous pouvez ajuster vos préférences
              d'emails dans votre compte.
            </p>
            <Link
              href="/account/settings"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Gérer mes préférences de notification →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
            <div className="max-w-md mx-auto px-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
