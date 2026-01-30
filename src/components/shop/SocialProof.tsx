'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/constants';

// Prénoms français réalistes
const FIRST_NAMES = [
  'Emma', 'Louise', 'Jade', 'Alice', 'Chloé', 'Léa', 'Manon', 'Inès', 'Camille', 'Sarah',
  'Lucas', 'Hugo', 'Louis', 'Gabriel', 'Raphaël', 'Arthur', 'Jules', 'Adam', 'Maël', 'Léo',
  'Marie', 'Sophie', 'Julie', 'Laura', 'Pauline', 'Mathilde', 'Clara', 'Anna', 'Lucie', 'Zoé',
  'Thomas', 'Antoine', 'Maxime', 'Alexandre', 'Nicolas', 'Pierre', 'Paul', 'Victor', 'Théo', 'Nathan'
];

// Villes françaises
const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Nice', 'Lille',
  'Strasbourg', 'Montpellier', 'Rennes', 'Grenoble', 'Rouen', 'Toulon', 'Angers'
];

// Types de commandes
const ORDER_TYPES = [
  { type: 'single', minAmount: 15, maxAmount: 25 },
  { type: 'pack', minAmount: 35, maxAmount: 60 },
  { type: 'subscription', minAmount: 40, maxAmount: 80 },
  { type: 'bulk', minAmount: 80, maxAmount: 150 },
];

// Générer une notification aléatoire
function generateNotification() {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const products = MOCK_PRODUCTS || [];
  const product = products.length > 0
    ? products[Math.floor(Math.random() * products.length)]
    : { name: 'Tamarque' };
  const orderType = ORDER_TYPES[Math.floor(Math.random() * ORDER_TYPES.length)];
  const amount = Math.floor(Math.random() * (orderType.maxAmount - orderType.minAmount) + orderType.minAmount);
  const minutesAgo = Math.floor(Math.random() * 15) + 1;

  let message = '';
  if (orderType.type === 'single') {
    message = `vient d'acheter ${product.name}`;
  } else if (orderType.type === 'pack') {
    const qty = Math.floor(Math.random() * 6) + 6;
    message = `vient de commander un pack de ${qty} bouteilles`;
  } else if (orderType.type === 'subscription') {
    message = `vient de s'abonner à la formule Athlète`;
  } else {
    message = `vient de passer une grosse commande`;
  }

  return {
    id: Date.now(),
    name,
    city,
    message,
    amount,
    minutesAgo,
    product,
  };
}

// Composant de notification popup
export function SocialProofPopup() {
  const [notification, setNotification] = useState<ReturnType<typeof generateNotification> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Première notification après 5-10 secondes
    const initialDelay = Math.random() * 5000 + 5000;

    const showNotification = () => {
      const newNotification = generateNotification();
      setNotification(newNotification);
      setIsVisible(true);

      // Cacher après 5 secondes
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Timer initial
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Interval pour les notifications suivantes (15-45 secondes)
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 30000 + 15000;
      setTimeout(showNotification, randomDelay);
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF1493] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {notification.name[0]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{notification.name}</span>
                <span className="text-gray-500"> de {notification.city}</span>
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  Il y a {notification.minutesAgo} min
                </span>
                <span className="text-xs font-semibold text-[#00D9A5]">
                  {notification.amount}€
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Verified badge */}
          <div className="flex items-center gap-1 mt-2 ml-2">
            <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-500">Achat vérifié</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant de compteur de visiteurs en ligne
export function LiveVisitorCount() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Générer un nombre initial basé sur l'heure
    const hour = new Date().getHours();
    let baseCount = 15;

    // Plus de visiteurs pendant les heures de pointe
    if (hour >= 12 && hour <= 14) baseCount = 45; // Pause déjeuner
    else if (hour >= 18 && hour <= 21) baseCount = 65; // Soirée
    else if (hour >= 9 && hour <= 11) baseCount = 35; // Matinée
    else if (hour >= 22 || hour <= 6) baseCount = 8; // Nuit

    // Ajouter une variation aléatoire
    const variation = Math.floor(Math.random() * 20) - 10;
    setCount(Math.max(5, baseCount + variation));
  }, []);

  // Mise à jour fréquente (toutes les 3-8 secondes)
  useEffect(() => {
    const updateCount = () => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 à +2
        const newCount = Math.max(5, Math.min(100, prev + change));
        if (newCount !== prev) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
        }
        return newCount;
      });
    };

    // Premier update après 3-5 secondes
    const initialTimeout = setTimeout(updateCount, Math.random() * 2000 + 3000);

    // Puis updates réguliers toutes les 3-8 secondes
    const interval = setInterval(updateCount, Math.random() * 5000 + 3000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9A5] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D9A5]" />
      </span>
      <span className="text-gray-600">
        <motion.span
          key={count}
          initial={{ scale: 1.3, color: '#00D9A5' }}
          animate={{ scale: 1, color: '#0A0A0A' }}
          transition={{ duration: 0.3 }}
          className="font-semibold inline-block"
        >
          {count}
        </motion.span> personnes consultent nos produits
      </span>
    </div>
  );
}

// Badge de stock faible
export function LowStockBadge({ stock }: { stock: number }) {
  if (stock > 10) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      Plus que {stock} en stock
    </motion.div>
  );
}

// Badge "Populaire" / "Tendance"
export function TrendingBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B35] text-white text-xs font-bold uppercase tracking-wider rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
      Tendance
    </div>
  );
}

// Badge "X personnes regardent ce produit"
export function ViewingNowBadge({ productId }: { productId: string }) {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Générer un nombre basé sur le productId pour consistance
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const baseViewers = (hash % 12) + 3;
    setViewers(baseViewers);
  }, [productId]);

  // Variation toutes les 4-10 secondes
  useEffect(() => {
    const updateViewers = () => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 à +2
        return Math.max(2, Math.min(25, prev + change));
      });
    };

    const interval = setInterval(updateViewers, Math.random() * 6000 + 4000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]" />
      </span>
      <span>
        <motion.span
          key={viewers}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="font-medium inline-block"
        >
          {viewers}
        </motion.span> personnes regardent ce produit
      </span>
    </div>
  );
}

// Barre d'urgence en haut de page
export function UrgencyBar() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();

    // Messages différents selon le contexte
    const messages = [
      '🔥 DERNIÈRES HEURES : -15% avec le code ENERGY15',
      '⚡ Livraison EXPRESS offerte dès 50€ aujourd\'hui',
      '🎁 1 shaker offert pour toute commande de pack',
      '💪 Déjà 1 247 commandes cette semaine',
      '🚀 Nouveau : Abonnement flexible, annulation à tout moment',
    ];

    // Message spécial le week-end
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      messages.unshift('🎉 WEEK-END SPORTIF : -20% sur les packs avec WEEKEND20');
    }

    // Message spécial le soir
    if (hour >= 18 && hour <= 21) {
      messages.unshift('⏰ Commande avant 21h = expédié demain matin');
    }

    // Message spécial le matin
    if (hour >= 7 && hour <= 10) {
      messages.unshift('☀️ Bien commencer la journée : ton boost protéiné t\'attend');
    }

    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-[#0A0A0A] text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-sm font-medium text-center">
          {message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Compteur de ventes récentes
export function RecentSalesCount() {
  const [sales, setSales] = useState(0);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    // Simuler des ventes basées sur l'heure
    const hour = new Date().getHours();
    let baseSales = 12;

    if (hour >= 12 && hour <= 14) baseSales = 28;
    else if (hour >= 18 && hour <= 21) baseSales = 35;
    else if (hour >= 9 && hour <= 11) baseSales = 22;

    setSales(baseSales + Math.floor(Math.random() * 10));
  }, []);

  // Incrémenter régulièrement (toutes les 8-20 secondes, 60% de chance)
  useEffect(() => {
    const tryIncrement = () => {
      if (Math.random() > 0.4) { // 60% de chance d'incrémenter
        setSales(prev => prev + 1);
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 500);
      }
    };

    // Premier incrément après 5-10 secondes
    const initialTimeout = setTimeout(tryIncrement, Math.random() * 5000 + 5000);

    // Puis essayer d'incrémenter toutes les 8-20 secondes
    const interval = setInterval(tryIncrement, Math.random() * 12000 + 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      animate={justUpdated ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 px-4 py-2 bg-[#00D9A5]/10 rounded-full"
    >
      <svg className="w-4 h-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-[#0A0A0A]">
        <motion.span
          key={sales}
          initial={{ scale: 1.4, color: '#FF6B35' }}
          animate={{ scale: 1, color: '#00D9A5' }}
          transition={{ duration: 0.4 }}
          className="font-bold inline-block"
        >
          {sales}
        </motion.span> ventes dans les dernières 24h
      </span>
    </motion.div>
  );
}
