'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS, FLAVOR_COLORS } from '@/lib/constants';
import type { Product } from '@/types';

type PackSize = 6 | 12 | 24;

interface FlavorSelection {
  productId: string;
  quantity: number;
}

const PACK_SIZES: { size: PackSize; label: string; discount: number }[] = [
  { size: 6, label: '6 bouteilles', discount: 10 },
  { size: 12, label: '12 bouteilles', discount: 15 },
  { size: 24, label: '24 bouteilles', discount: 20 },
];

export default function PackConfigurator() {
  const [packSize, setPackSize] = useState<PackSize>(12);
  const [selections, setSelections] = useState<FlavorSelection[]>(
    MOCK_PRODUCTS.map((p) => ({ productId: p.id, quantity: 0 }))
  );

  const totalSelected = selections.reduce((sum, s) => sum + s.quantity, 0);
  const remaining = packSize - totalSelected;

  const currentDiscount = PACK_SIZES.find((p) => p.size === packSize)?.discount || 0;

  const { subtotal, total, savings } = useMemo(() => {
    let sub = 0;
    selections.forEach((sel) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === sel.productId);
      if (product) {
        sub += product.price * sel.quantity;
      }
    });
    const discount = sub * (currentDiscount / 100);
    return {
      subtotal: sub,
      total: sub - discount,
      savings: discount,
    };
  }, [selections, currentDiscount]);

  const updateQuantity = (productId: string, delta: number) => {
    setSelections((prev) =>
      prev.map((sel) => {
        if (sel.productId !== productId) return sel;
        const newQty = Math.max(0, sel.quantity + delta);
        if (delta > 0 && remaining <= 0) return sel;
        return { ...sel, quantity: newQty };
      })
    );
  };

  const resetSelections = () => {
    setSelections(MOCK_PRODUCTS.map((p) => ({ productId: p.id, quantity: 0 })));
  };

  const handlePackSizeChange = (newSize: PackSize) => {
    setPackSize(newSize);
    if (totalSelected > newSize) {
      resetSelections();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] p-6 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Compose ton pack</h2>
        <p className="opacity-90">Choisis tes saveurs préférées et économise jusqu&apos;à 20%</p>
      </div>

      <div className="p-6 md:p-8">
        {/* Pack Size Selector */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">1. Choisis la taille de ton pack</h3>
          <div className="grid grid-cols-3 gap-4">
            {PACK_SIZES.map(({ size, label, discount }) => (
              <button
                key={size}
                onClick={() => handlePackSizeChange(size)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  packSize === size
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl font-bold">{size}</div>
                <div className="text-sm text-gray-600">{label}</div>
                <div className="absolute -top-2 -right-2 bg-[#00D9A5] text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Flavor Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">2. Sélectionne tes saveurs</h3>
            <div className="text-sm">
              <span className={remaining === 0 ? 'text-[#00D9A5] font-bold' : 'text-gray-600'}>
                {totalSelected}/{packSize} sélectionnées
              </span>
              {remaining > 0 && (
                <span className="text-gray-400 ml-2">({remaining} restantes)</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_PRODUCTS.map((product) => {
              const selection = selections.find((s) => s.productId === product.id);
              const quantity = selection?.quantity || 0;
              const color = FLAVOR_COLORS[product.flavor] || '#FF6B35';

              return (
                <motion.div
                  key={product.id}
                  layout
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    quantity > 0 ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {/* Product Color Indicator */}
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: color + '30' }}
                  >
                    <div
                      className="w-6 h-12 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.price.toFixed(2)}€ / unité</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={quantity === 0}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      −
                    </button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={quantity}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="w-8 text-center text-xl font-bold"
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      disabled={remaining === 0}
                      className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e55a2a] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-[#00D9A5] font-semibold">
              <span>Réduction pack (-{currentDiscount}%)</span>
              <span>-{savings.toFixed(2)}€</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          <button
            disabled={totalSelected !== packSize}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {totalSelected === packSize
              ? 'Ajouter au panier'
              : `Sélectionne encore ${remaining} bouteille${remaining > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
