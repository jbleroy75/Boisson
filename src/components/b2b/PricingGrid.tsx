'use client';

import { Check, Info } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  discount: number;
  features: string[];
  recommended?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    minQuantity: 100,
    maxQuantity: 499,
    pricePerUnit: 2.5,
    discount: 15,
    features: [
      'Prix unitaire: 2,50€',
      'Commande min: 100 unités',
      'Livraison standard',
      'Support email',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    minQuantity: 500,
    maxQuantity: 999,
    pricePerUnit: 2.2,
    discount: 25,
    features: [
      'Prix unitaire: 2,20€',
      'Commande min: 500 unités',
      'Livraison prioritaire',
      'Support téléphonique',
      'Merchandising gratuit',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    minQuantity: 1000,
    maxQuantity: 4999,
    pricePerUnit: 1.95,
    discount: 35,
    features: [
      'Prix unitaire: 1,95€',
      'Commande min: 1000 unités',
      'Livraison express gratuite',
      'Account manager dédié',
      'Merchandising premium',
      'Formation équipe',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    minQuantity: 5000,
    maxQuantity: null,
    pricePerUnit: 1.7,
    discount: 45,
    features: [
      'Prix unitaire: 1,70€',
      'Commande min: 5000 unités',
      'Logistique sur mesure',
      'Account manager senior',
      'Co-branding possible',
      'Conditions personnalisées',
    ],
  },
];

interface PricingGridProps {
  currentTier?: string;
  onSelectTier?: (tierId: string) => void;
  showSelect?: boolean;
}

export function PricingGrid({ currentTier, onSelectTier, showSelect = false }: PricingGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {pricingTiers.map((tier) => (
        <div
          key={tier.id}
          className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
            tier.recommended
              ? 'ring-2 ring-orange-500'
              : 'border border-gray-200 dark:border-gray-700'
          }`}
        >
          {tier.recommended && (
            <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center text-sm py-1 font-medium">
              Recommandé
            </div>
          )}

          <div className={`p-6 ${tier.recommended ? 'pt-10' : ''}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {tier.name}
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-orange-500">
                {tier.pricePerUnit.toFixed(2)}€
              </span>
              <span className="text-gray-600 dark:text-gray-400">/unité</span>
            </div>
            <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm px-3 py-1 rounded-full mb-4">
              -{tier.discount}% vs prix public
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {tier.minQuantity.toLocaleString()}
              {tier.maxQuantity ? ` - ${tier.maxQuantity.toLocaleString()}` : '+'}
              {' '}unités/mois
            </div>

            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {showSelect && (
              <button
                onClick={() => onSelectTier?.(tier.id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  currentTier === tier.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {currentTier === tier.id ? 'Sélectionné' : 'Sélectionner'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PricingCalculator() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mt-8">
      <div className="flex items-start gap-3">
        <Info className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Comment sont calculés les prix ?
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Votre tarif est déterminé par votre volume mensuel moyen sur les 3 derniers mois.
            Les réductions sont calculées par rapport au prix public de 2,95€/unité.
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Les prix sont HT, TVA applicable : 5,5%</li>
            <li>• Franco de port à partir de 500€ HT</li>
            <li>• Paiement à 30 jours fin de mois</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PricingGrid;
