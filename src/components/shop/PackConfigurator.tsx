'use client';

import { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MOCK_PRODUCTS, FLAVOR_COLORS } from '@/lib/constants';

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
  const shouldReduceMotion = useReducedMotion();
  const headingId = useId();
  const packSizeId = useId();
  const flavorSelectionId = useId();
  const summaryId = useId();

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

  // Animation settings respecting reduced motion
  const animationDuration = shouldReduceMotion ? 0 : 0.15;

  return (
    <section
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
      aria-labelledby={headingId}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] p-6 text-white">
        <h2 id={headingId} className="text-2xl md:text-3xl font-bold mb-2">
          Compose ton pack
        </h2>
        <p className="opacity-90">Choisis tes saveurs préférées et économise jusqu&apos;à 20%</p>
      </div>

      <div className="p-6 md:p-8">
        {/* Pack Size Selector */}
        <fieldset className="mb-8" aria-describedby={packSizeId}>
          <legend className="text-lg font-semibold mb-4" id={packSizeId}>
            1. Choisis la taille de ton pack
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup">
            {PACK_SIZES.map(({ size, label, discount }) => (
              <button
                key={size}
                type="button"
                onClick={() => handlePackSizeChange(size)}
                className={`relative p-4 rounded-xl border-2 transition-all touch-target ${
                  packSize === size
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                role="radio"
                aria-checked={packSize === size}
                aria-label={`Pack de ${size} bouteilles avec ${discount}% de réduction`}
              >
                <div className="text-2xl font-bold">{size}</div>
                <div className="text-sm text-gray-600">{label}</div>
                <div
                  className="absolute -top-2 -right-2 bg-[#00D9A5] text-white text-xs font-bold px-2 py-1 rounded-full"
                  aria-hidden="true"
                >
                  -{discount}%
                </div>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Flavor Selection */}
        <div className="mb-8" role="group" aria-labelledby={flavorSelectionId}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" id={flavorSelectionId}>
              2. Sélectionne tes saveurs
            </h3>
            <div
              className="text-sm"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className={remaining === 0 ? 'text-[#00D9A5] font-bold' : 'text-gray-600'}>
                {totalSelected}/{packSize} sélectionnées
              </span>
              {remaining > 0 && (
                <span className="text-gray-400 ml-2">
                  ({remaining} restante{remaining > 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          <ul className="space-y-4" aria-label="Liste des saveurs disponibles">
            {MOCK_PRODUCTS.map((product) => {
              const selection = selections.find((s) => s.productId === product.id);
              const quantity = selection?.quantity || 0;
              const color = FLAVOR_COLORS[product.flavor] || '#FF6B35';
              const productLabelId = `product-${product.id}-label`;
              const productQuantityId = `product-${product.id}-quantity`;

              return (
                <motion.li
                  key={product.id}
                  layout={!shouldReduceMotion}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    quantity > 0 ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-100 bg-gray-50'
                  }`}
                  aria-labelledby={productLabelId}
                >
                  {/* Product Color Indicator */}
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: color + '30' }}
                    aria-hidden="true"
                  >
                    <div
                      className="w-6 h-12 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h4 id={productLabelId} className="font-semibold">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">{product.price.toFixed(2)}€ / unité</p>
                  </div>

                  {/* Quantity Controls */}
                  <div
                    className="flex items-center justify-center sm:justify-end gap-3"
                    role="group"
                    aria-label={`Quantité de ${product.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={quantity === 0}
                      className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors touch-target"
                      aria-label={`Retirer une bouteille de ${product.name}`}
                      aria-describedby={productQuantityId}
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={quantity}
                        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                        transition={{ duration: animationDuration }}
                        id={productQuantityId}
                        className="w-8 text-center text-xl font-bold"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, 1)}
                      disabled={remaining === 0}
                      className="w-11 h-11 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e55a2a] transition-colors touch-target"
                      aria-label={`Ajouter une bouteille de ${product.name}`}
                      aria-describedby={productQuantityId}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Summary */}
        <div
          className="bg-gray-50 rounded-xl p-6"
          role="region"
          aria-labelledby={summaryId}
        >
          <h3 id={summaryId} className="text-lg font-semibold mb-4">
            Récapitulatif
          </h3>

          <dl className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <dt>Sous-total</dt>
              <dd>{subtotal.toFixed(2)}€</dd>
            </div>
            <div className="flex justify-between text-[#00D9A5] font-semibold">
              <dt>Réduction pack (-{currentDiscount}%)</dt>
              <dd>-{savings.toFixed(2)}€</dd>
            </div>
            <div className="border-t pt-2 flex justify-between text-xl font-bold">
              <dt>Total</dt>
              <dd>{total.toFixed(2)}€</dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={totalSelected !== packSize}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all touch-target"
            aria-describedby={totalSelected !== packSize ? 'cart-help' : undefined}
          >
            {totalSelected === packSize
              ? 'Ajouter au panier'
              : `Sélectionne encore ${remaining} bouteille${remaining > 1 ? 's' : ''}`}
          </button>
          {totalSelected !== packSize && (
            <p id="cart-help" className="sr-only">
              Tu dois sélectionner {remaining} bouteille{remaining > 1 ? 's' : ''} de plus pour compléter ton pack.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
