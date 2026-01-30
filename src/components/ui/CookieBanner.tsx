'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_CONSENT_KEY = 'tamarque_cookie_consent';

type ConsentType = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentType>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (fullConsent: boolean) => {
    const finalConsent: ConsentType = fullConsent
      ? { necessary: true, analytics: true, marketing: true }
      : consent;

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(finalConsent));

    if (typeof window !== 'undefined' && finalConsent.analytics) {
      // Initialize Google Analytics
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    if (typeof window !== 'undefined' && finalConsent.marketing) {
      // Initialize Facebook Pixel
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('consent', 'grant');
    }

    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent({ necessary: true, analytics: false, marketing: false });
    saveConsent(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          {!showDetails ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-700">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                  En continuant, vous acceptez notre{' '}
                  <Link
                    href="/privacy"
                    className="text-[var(--color-orange)] hover:underline"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Personnaliser
                </button>
                <button
                  onClick={handleReject}
                  className="btn-secondary !py-2 !px-4"
                >
                  Refuser
                </button>
                <button
                  onClick={() => saveConsent(true)}
                  className="btn-primary !py-2 !px-4"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Paramètres des cookies</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cookies nécessaires</p>
                    <p className="text-sm text-gray-500">
                      Essentiels au fonctionnement du site
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 rounded accent-[var(--color-orange)]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cookies analytiques</p>
                    <p className="text-sm text-gray-500">
                      Nous aident à améliorer le site (Google Analytics)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) =>
                      setConsent({ ...consent, analytics: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-[var(--color-orange)]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cookies marketing</p>
                    <p className="text-sm text-gray-500">
                      Permettent la publicité ciblée (Facebook Pixel)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) =>
                      setConsent({ ...consent, marketing: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-[var(--color-orange)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Retour
                </button>
                <button
                  onClick={() => saveConsent(false)}
                  className="btn-primary !py-2 !px-4"
                >
                  Enregistrer mes choix
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function getCookieConsent(): ConsentType | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  return stored ? JSON.parse(stored) : null;
}
