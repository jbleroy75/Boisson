'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { FLAVOR_COLORS } from '@/lib/constants';
import { createCheckout, addToCheckout } from '@/lib/shopify';

export default function CartPage() {
  const { items, itemCount, subtotal, discount, total, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Create Shopify checkout
      const checkout = await createCheckout();

      if (checkout) {
        // Add items to checkout
        // Note: In production, you'd map cart items to Shopify variant IDs
        const lineItems = items.map((item) => ({
          variantId: item.product.id, // This should be Shopify variant ID
          quantity: item.quantity,
        }));

        const updatedCheckout = await addToCheckout(checkout.id, lineItems);

        if (updatedCheckout?.webUrl) {
          // Redirect to Shopify checkout
          window.location.href = updatedCheckout.webUrl;
          return;
        }
      }

      // Fallback: redirect to mock checkout success
      clearCart();
      window.location.href = '/merci';
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Header cartItemCount={itemCount} />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Ton panier</h1>
            <p className="text-gray-600">
              {itemCount === 0
                ? 'Ton panier est vide'
                : `${itemCount} article${itemCount !== 1 ? 's' : ''} dans ton panier`}
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold mb-4">Ton panier est vide</h2>
              <p className="text-gray-600 mb-8">
                On dirait que tu n'as pas encore ajouté de produits.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition-colors"
              >
                Découvrir nos produits
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.isSubscription}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div
                          className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: FLAVOR_COLORS[item.product.flavor] + '30' }}
                        >
                          <div
                            className="w-10 h-20 rounded-xl"
                            style={{ backgroundColor: FLAVOR_COLORS[item.product.flavor] }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link
                                href={`/shop/${item.product.slug}`}
                                className="font-bold text-lg hover:text-[#FF6B35] transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              {item.isSubscription && (
                                <span className="ml-2 px-2 py-0.5 bg-[#00D9A5]/10 text-[#00D9A5] text-xs font-medium rounded-full">
                                  Abonnement -15%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Supprimer l'article"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                            {item.product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-2 font-semibold min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-bold text-lg text-[#FF6B35]">
                                $
                                {(
                                  item.product.price *
                                  item.quantity *
                                  (item.isSubscription ? 0.85 : 1)
                                ).toFixed(2)}
                              </div>
                              {item.isSubscription && (
                                <div className="text-sm text-gray-400 line-through">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-500 text-sm transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{subtotal.toFixed(2)}€</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#00D9A5]">
                        <span>Réduction abonnement</span>
                        <span className="font-medium">-{discount.toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium text-[#00D9A5]">
                        {total >= 50 ? 'GRATUITE' : '5,99€'}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg mb-6">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[#FF6B35]">
                      {(total + (total >= 50 ? 0 : 5.99)).toFixed(2)}€
                    </span>
                  </div>

                  {total < 50 && (
                    <div className="bg-[#FF6B35]/10 rounded-lg p-4 mb-6">
                      <p className="text-sm text-[#FF6B35]">
                        Plus que {(50 - total).toFixed(2)}€ pour la livraison gratuite !
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || items.length === 0}
                    className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
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
                        Traitement en cours...
                      </span>
                    ) : (
                      'Passer commande'
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🔒</span>
                      <span>Paiement sécurisé SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📦</span>
                      <span>Livraison gratuite dès 50€</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>↩️</span>
                      <span>Retour sous 30 jours</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Continue Shopping */}
          {items.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/shop"
                className="text-[#FF6B35] hover:underline font-medium"
              >
                ← Continuer mes achats
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
