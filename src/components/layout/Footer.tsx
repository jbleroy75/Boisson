'use client';

import Link from 'next/link';
import { useState } from 'react';

interface FooterProps {
  isB2B?: boolean;
}

export default function Footer({ isB2B = false }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Tamarque - Accueil">
              <span className="text-2xl font-bold">
                TAMAR<span className="text-[#FF6B35]">QUE</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              La boisson protéinée nouvelle génération. 20g de protéines, 100% naturel, zéro ballonnement.
            </p>
            {/* Social icons */}
            <div className="flex space-x-4" role="list" aria-label="Réseaux sociaux">
              <a
                href="https://instagram.com/tamarque"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors touch-target"
                aria-label="Suivez-nous sur Instagram (ouvre dans un nouvel onglet)"
                role="listitem"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@tamarque"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors touch-target"
                aria-label="Suivez-nous sur TikTok (ouvre dans un nouvel onglet)"
                role="listitem"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/tamarque"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors touch-target"
                aria-label="Suivez-nous sur Facebook (ouvre dans un nouvel onglet)"
                role="listitem"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <nav aria-label="Boutique">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Boutique</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link href="/pack" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Créer mon pack
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=best-sellers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Meilleures ventes
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Entreprise">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/fournisseurs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Devenir distributeur
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" id="newsletter-heading">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Recevez 10% de réduction sur votre première commande et des offres exclusives.
            </p>
            {isSubscribed ? (
              <div
                className="text-[#00D9A5] text-sm flex items-center gap-2"
                role="status"
                aria-live="polite"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Merci pour votre inscription !
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-2"
                aria-labelledby="newsletter-heading"
              >
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Adresse email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    required
                    disabled={isLoading}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-r-none text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] text-sm disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg sm:rounded-l-none hover:bg-[#E55A2B] transition-colors text-sm font-medium disabled:opacity-50 touch-target"
                  aria-label={isLoading ? 'Inscription en cours...' : "S'inscrire à la newsletter"}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="sr-only">Chargement</span>
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>
            )}
            {error && (
              <p id="newsletter-error" className="text-red-400 text-xs mt-2" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <nav aria-label="Liens légaux" className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="/mentions-legales" className="text-gray-500 hover:text-gray-400 text-xs">
                Mentions légales
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-xs">
                Politique de confidentialité
              </Link>
              <Link href="/cgv" className="text-gray-500 hover:text-gray-400 text-xs">
                CGV
              </Link>
              <Link href="/shipping" className="text-gray-500 hover:text-gray-400 text-xs">
                Livraison
              </Link>
              <Link href="/retours" className="text-gray-500 hover:text-gray-400 text-xs">
                Retours
              </Link>
            </nav>

            {/* Payment methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-xs">Paiement sécurisé :</span>
              <div className="flex gap-2" role="list" aria-label="Moyens de paiement acceptés">
                {/* Mastercard */}
                <div role="listitem" aria-label="Mastercard">
                  <svg className="w-8 h-5 text-gray-500" viewBox="0 0 38 24" fill="currentColor" aria-hidden="true">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1A1A" />
                    <path d="M14 19a7 7 0 100-14 7 7 0 000 14z" fill="#EB001B" />
                    <path d="M24 19a7 7 0 100-14 7 7 0 000 14z" fill="#F79E1B" />
                    <path d="M19 17.5a6.97 6.97 0 002.5-5.5 6.97 6.97 0 00-2.5-5.5 6.97 6.97 0 00-2.5 5.5c0 2.2 1 4.2 2.5 5.5z" fill="#FF5F00" />
                  </svg>
                </div>
                {/* Visa */}
                <div role="listitem" aria-label="Visa">
                  <svg className="w-8 h-5 text-gray-500" viewBox="0 0 38 24" fill="currentColor" aria-hidden="true">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1A1A" />
                    <path d="M14.2 16.6l1.4-8.6h2.2l-1.4 8.6h-2.2zm9.3-8.4c-.4-.2-1.1-.3-2-.3-2.2 0-3.7 1.2-3.7 2.8 0 1.2 1.1 1.9 2 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 2c.5.3 1.5.5 2.5.5 2.3 0 3.8-1.1 3.8-2.9 0-1-.6-1.7-1.9-2.3-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.3-.8.7 0 1.3.2 1.7.4l.2.1.4-1.9v-.2zm5.5-.2h-1.7c-.5 0-.9.2-1.1.7l-3.2 7.7h2.3l.5-1.3h2.8l.3 1.3h2l-1.9-8.4zm-2.6 5.4l.9-2.4c0 .1.2-.5.3-.8l.2.7.5 2.5h-1.9zm-12.6 0l-2.2-5.8c-.2-.6-.6-.8-1.2-.8H7l-.1.4c.8.2 1.6.5 2.1.9.3.2.4.4.5.7l1.6 6h2.3l3.5-8.4h-2.3l-2.4 6.4-.3.6z" fill="#fff" />
                  </svg>
                </div>
                {/* Apple Pay */}
                <div role="listitem" aria-label="Apple Pay">
                  <svg className="w-8 h-5 text-gray-500" viewBox="0 0 38 24" fill="currentColor" aria-hidden="true">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1A1A" />
                    <path d="M25.4 12.8c-.1-.8-.6-1.5-1.7-1.5-.5 0-.9.1-1.2.4-.3.3-.5.7-.6 1.1h3.5zm1.8 1.8h-5.4c.1.5.3.8.7 1.1.4.3.9.4 1.4.4.7 0 1.3-.2 1.8-.6l1.3 1.2c-.8.7-1.8 1.1-3.2 1.1-2.4 0-4-1.5-4-3.8 0-2.3 1.6-3.8 3.8-3.8 2.1 0 3.6 1.4 3.6 3.6v.8z" fill="#fff" />
                    <path d="M19 16.5h-1.4l.1-7.1h1.4l-.1 7.1zm-5 0h-1.4l.1-5.1h-1.5l.1-1h4.3l-.1 1h-1.5l-.1 5.1h.1zm-4.3 0H8.3l.1-7.1h1.4l-.1 7.1z" fill="#fff" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            © {currentYear} Tamarque. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
