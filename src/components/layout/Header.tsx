'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';

interface HeaderProps {
  cartItemCount?: number;
  isB2B?: boolean;
}

export default function Header({ cartItemCount: propCartItemCount, isB2B = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  // Use cart context if available, otherwise fall back to prop
  let cartItemCount = propCartItemCount ?? 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cart = useCart();
    cartItemCount = cart.itemCount;
  } catch {
    // CartProvider not available, use prop value
  }

  // Close menu on Escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  // Focus trap in mobile menu
  const handleMenuKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  // Add/remove escape key listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus first menu item when opening
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Small delay to ensure animation has started
      const timer = setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Animation variants respecting reduced motion
  const menuVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
      };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={isB2B ? '/fournisseurs' : '/'}
            className="flex items-center touch-target"
            aria-label={`Tamarque - ${isB2B ? 'Portail fournisseurs' : 'Accueil'}`}
          >
            <span className="text-2xl font-bold text-[#1A1A1A]">
              TAMAR<span className="text-[#FF6B35]">QUE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-[#FF6B35] transition-colors font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            {!isB2B && (
              <Link
                href="/fournisseurs"
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm py-2"
              >
                Portail fournisseurs
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart (only for main site) */}
            {!isB2B && (
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
                aria-label={`Panier${cartItemCount > 0 ? `, ${cartItemCount} article${cartItemCount > 1 ? 's' : ''}` : ' (vide)'}`}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                    aria-hidden="true"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Account */}
            <Link
              href={isB2B ? '/fournisseurs/dashboard' : '/account'}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
              aria-label={isB2B ? 'Tableau de bord fournisseur' : 'Mon compte'}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              ref={menuButtonRef}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 fixed left-0 right-0 z-50 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ top: '64px' }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            onKeyDown={handleMenuKeyDown}
          >
            <nav className="px-4 py-4 space-y-1 safe-area-bottom" aria-label="Navigation mobile">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.href}
                  ref={index === 0 ? firstMenuItemRef : undefined}
                  href={link.href}
                  className="block py-3 px-4 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-50 transition-colors font-medium rounded-lg mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isB2B && (
                <>
                  <div className="border-t border-gray-100 my-2" role="separator" />
                  <Link
                    href="/fournisseurs"
                    className="block py-3 px-4 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-sm rounded-lg mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portail fournisseurs
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
