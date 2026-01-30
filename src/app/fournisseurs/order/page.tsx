'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS, B2B_VOLUME_PRICING, FLAVOR_COLORS } from '@/lib/constants';

export default function B2BOrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_PRODUCTS.map((p) => [p.id, 0]))
  );

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

  if (!session) {
    redirect('/login?callbackUrl=/fournisseurs/order');
  }

  const totalUnits = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  }, [quantities]);

  const currentTier = useMemo(() => {
    return B2B_VOLUME_PRICING.find(
      (tier) =>
        totalUnits >= tier.minQuantity && (tier.maxQuantity === null || totalUnits <= tier.maxQuantity)
    );
  }, [totalUnits]);

  const basePrice = 3.99;
  const discountedPrice = basePrice * (1 - (currentTier?.discountPercent || 0) / 100);
  const subtotal = totalUnits * discountedPrice;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + delta),
    }));
  };

  const setQuantityDirect = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, value),
    }));
  };

  const handlePlaceOrder = async () => {
    if (totalUnits < 100) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const items = MOCK_PRODUCTS
        .filter((p) => quantities[p.id] > 0)
        .map((p) => ({
          product_id: p.id,
          product_name: p.name,
          quantity: quantities[p.id],
          unit_price: discountedPrice,
        }));

      const response = await fetch('/api/b2b/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Redirect to orders page
      router.push('/fournisseurs/orders?success=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Place B2B Order</h1>
            <p className="text-gray-600">Select quantities for each product. Volume discounts apply automatically.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
              {/* Volume Pricing Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white rounded-2xl p-6"
              >
                <h2 className="font-bold text-lg mb-4">Volume Pricing Tiers</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {B2B_VOLUME_PRICING.map((tier, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl ${
                        currentTier === tier ? 'bg-white text-[#FF6B35]' : 'bg-white/20'
                      }`}
                    >
                      <div className="font-bold">
                        {tier.maxQuantity ? `${tier.minQuantity}-${tier.maxQuantity}` : `${tier.minQuantity}+`}
                      </div>
                      <div className="text-sm">
                        {tier.discountPercent > 0 ? `${tier.discountPercent}% OFF` : 'Standard'}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Select Products</h2>
                </div>
                <div className="divide-y">
                  {MOCK_PRODUCTS.map((product) => (
                    <div key={product.id} className="p-6 flex items-center gap-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: FLAVOR_COLORS[product.flavor] + '30' }}
                      >
                        <div
                          className="w-8 h-14 rounded"
                          style={{ backgroundColor: FLAVOR_COLORS[product.flavor] }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description.slice(0, 60)}...</p>
                      </div>
                      <div className="text-right mr-6">
                        <div className="font-bold text-[#FF6B35]">€{discountedPrice.toFixed(2)}</div>
                        {currentTier && currentTier.discountPercent > 0 && (
                          <div className="text-sm text-gray-400 line-through">€{basePrice.toFixed(2)}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, -10)}
                          className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          -10
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={quantities[product.id]}
                          onChange={(e) => setQuantityDirect(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-10 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, 10)}
                          className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {MOCK_PRODUCTS.filter((p) => quantities[p.id] > 0).map((product) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {product.name} x {quantities[product.id]}
                      </span>
                      <span className="font-medium">
                        €{(quantities[product.id] * discountedPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {totalUnits === 0 && (
                    <p className="text-gray-400 text-sm">No items selected</p>
                  )}
                </div>

                <hr className="my-4" />

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Units</span>
                    <span className="font-semibold">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Unit</span>
                    <span className="font-semibold">€{discountedPrice.toFixed(2)}</span>
                  </div>
                  {currentTier && currentTier.discountPercent > 0 && (
                    <div className="flex justify-between text-[#00D9A5]">
                      <span>Volume Discount</span>
                      <span className="font-semibold">-{currentTier.discountPercent}%</span>
                    </div>
                  )}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg mb-6">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#FF6B35]">€{subtotal.toFixed(2)}</span>
                </div>

                {/* Minimum Order Warning */}
                {totalUnits > 0 && totalUnits < 100 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> Minimum order is 100 units for volume pricing.
                      Add {100 - totalUnits} more units to unlock 30% discount.
                    </p>
                  </div>
                )}

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>💳</span>
                    <span>NET30 payment terms available</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <button
                  disabled={totalUnits < 100 || isSubmitting}
                  onClick={handlePlaceOrder}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                    totalUnits >= 100 && !isSubmitting
                      ? 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
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
                      Processing...
                    </span>
                  ) : totalUnits >= 100 ? (
                    'Place Order'
                  ) : (
                    'Min. 100 units required'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our B2B terms and conditions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer isB2B />
    </>
  );
}
