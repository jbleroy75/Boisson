import type { Product, SubscriptionTier, VolumePricing, Review } from '@/types';

// Brand colors
export const COLORS = {
  orange: '#FF6B35',
  green: '#00D9A5',
  pink: '#FF1493',
  black: '#1A1A1A',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Flavor colors for UI
export const FLAVOR_COLORS: Record<string, string> = {
  'yuzu-peach': '#FFD700',
  'hibiscus-raspberry': '#DC143C',
  'matcha-vanilla': '#90EE90',
  'coco-pineapple': '#FFFACD',
  'dragon-fruit-mango-passion': '#FF1493',
};

// Données produits mock (en attendant la connexion Shopify)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'yuzu-peach',
    name: 'Yuzu Pêche',
    description: 'Un mélange rafraîchissant de yuzu japonais et de pêche douce. Léger, acidulé, parfait pour la récupération post-entraînement.',
    price: 3.99,
    compareAtPrice: 4.99,
    images: ['/images/products/yuzu-peach-1.jpg', '/images/products/yuzu-peach-2.jpg'],
    flavor: 'yuzu-peach',
    sportType: ['endurance', 'recovery'],
    nutrition: {
      servingSize: '500ml',
      calories: 120,
      protein: 20,
      carbs: 8,
      sugar: 4,
      fat: 0,
      sodium: 150,
    },
    ingredients: ['Eau', 'Isolat de Whey', 'Extrait naturel de Yuzu', 'Purée de Pêche', 'Acide citrique', 'Stévia', 'Arômes naturels'],
    inStock: true,
  },
  {
    id: '2',
    slug: 'hibiscus-raspberry',
    name: 'Hibiscus Framboise',
    description: 'L\'hibiscus floral rencontre la framboise acidulée dans ce mélange riche en antioxydants. Goût intense, zéro ballonnement.',
    price: 3.99,
    compareAtPrice: 4.99,
    images: ['/images/products/hibiscus-raspberry-1.jpg', '/images/products/hibiscus-raspberry-2.jpg'],
    flavor: 'hibiscus-raspberry',
    sportType: ['recovery'],
    nutrition: {
      servingSize: '500ml',
      calories: 115,
      protein: 20,
      carbs: 7,
      sugar: 3,
      fat: 0,
      sodium: 140,
    },
    ingredients: ['Eau', 'Isolat de Whey', 'Extrait d\'Hibiscus', 'Purée de Framboise', 'Acide citrique', 'Stévia', 'Arômes naturels'],
    inStock: true,
  },
  {
    id: '3',
    slug: 'matcha-vanilla',
    name: 'Matcha Vanille',
    description: 'Matcha japonais premium avec une vanille onctueuse. Boost naturel de caféine avec une libération d\'énergie progressive.',
    price: 4.49,
    compareAtPrice: 5.49,
    images: ['/images/products/matcha-vanilla-1.jpg', '/images/products/matcha-vanilla-2.jpg'],
    flavor: 'matcha-vanilla',
    sportType: ['endurance', 'strength'],
    nutrition: {
      servingSize: '500ml',
      calories: 130,
      protein: 20,
      carbs: 10,
      sugar: 5,
      fat: 0,
      sodium: 160,
    },
    ingredients: ['Eau', 'Isolat de Whey', 'Matcha de cérémonie', 'Extrait de Vanille', 'Acide citrique', 'Stévia', 'Arômes naturels'],
    inStock: true,
  },
  {
    id: '4',
    slug: 'coco-pineapple',
    name: 'Coco Ananas',
    description: 'Un paradis tropical en bouteille. Base d\'eau de coco avec ananas frais pour une hydratation optimale.',
    price: 3.99,
    compareAtPrice: 4.99,
    images: ['/images/products/coco-pineapple-1.jpg', '/images/products/coco-pineapple-2.jpg'],
    flavor: 'coco-pineapple',
    sportType: ['endurance', 'recovery'],
    nutrition: {
      servingSize: '500ml',
      calories: 125,
      protein: 20,
      carbs: 9,
      sugar: 5,
      fat: 0,
      sodium: 180,
    },
    ingredients: ['Eau de Coco', 'Isolat de Whey', 'Purée d\'Ananas', 'Acide citrique', 'Stévia', 'Arômes naturels'],
    inStock: true,
  },
  {
    id: '5',
    slug: 'dragon-fruit-mango-passion',
    name: 'Pitaya Mangue Passion',
    description: 'Trio exotique de fruit du dragon, mangue et passion. Couleur rose vibrante, explosion de saveurs tropicales.',
    price: 4.49,
    compareAtPrice: 5.49,
    images: ['/images/products/dragon-fruit-1.jpg', '/images/products/dragon-fruit-2.jpg'],
    flavor: 'dragon-fruit-mango-passion',
    sportType: ['strength', 'recovery'],
    nutrition: {
      servingSize: '500ml',
      calories: 135,
      protein: 20,
      carbs: 11,
      sugar: 6,
      fat: 0,
      sodium: 150,
    },
    ingredients: ['Eau', 'Isolat de Whey', 'Purée de Pitaya', 'Purée de Mangue', 'Extrait de Fruit de la Passion', 'Acide citrique', 'Stévia', 'Arômes naturels'],
    inStock: true,
  },
];

// Formules d'abonnement
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    bottles: 12,
    discount: 15,
    price: 40.69,
    features: [
      '12 bouteilles par mois',
      '-15% sur le prix public',
      'Livraison gratuite',
      'Résiliable à tout moment',
    ],
  },
  {
    id: 'athlete',
    name: 'Athlète',
    bottles: 24,
    discount: 20,
    price: 76.61,
    features: [
      '24 bouteilles par mois',
      '-20% sur le prix public',
      'Livraison gratuite',
      'Accès anticipé aux nouvelles saveurs',
      'Résiliable à tout moment',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    bottles: 48,
    discount: 25,
    price: 143.64,
    features: [
      '48 bouteilles par mois',
      '-25% sur le prix public',
      'Livraison express gratuite',
      'Accès anticipé aux nouvelles saveurs',
      'Goodies exclusifs',
      'Résiliable à tout moment',
    ],
  },
];

// B2B Volume pricing
export const B2B_VOLUME_PRICING: VolumePricing[] = [
  { minQuantity: 1, maxQuantity: 99, discountPercent: 0 },
  { minQuantity: 100, maxQuantity: 499, discountPercent: 30 },
  { minQuantity: 500, maxQuantity: 999, discountPercent: 40 },
  { minQuantity: 1000, maxQuantity: null, discountPercent: 50 },
];

// Avis clients mock
export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    comment: 'Enfin une boisson protéinée qui ne ressemble pas à un milkshake ! La texture ice tea est incroyable et la saveur Yuzu Pêche est addictive.',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    author: 'Marc T.',
    rating: 5,
    comment: 'Je m\'entraîne deux fois par jour et c\'est parfait. Zéro ballonnement, super goût, et j\'attends avec impatience ma dose de protéines maintenant.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    author: 'Emma L.',
    rating: 4,
    comment: 'Le Matcha Vanille me donne le boost d\'énergie parfait avant mes runs du matin. J\'adore que ce soit 100% naturel.',
    date: '2024-01-08',
    verified: true,
  },
  {
    id: '4',
    author: 'David K.',
    rating: 5,
    comment: 'J\'ai abandonné mes shakers classiques et je ne reviendrai jamais en arrière. La saveur Pitaya est incroyable !',
    date: '2024-01-05',
    verified: true,
  },
  {
    id: '5',
    author: 'Lisa R.',
    rating: 5,
    comment: 'En tant que triathlète, j\'ai besoin de quelque chose de léger qui ne me plombe pas. Tamarque c\'est exactement ce que je cherchais.',
    date: '2024-01-02',
    verified: true,
  },
];

// French regions for B2B
export const FRENCH_REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Grand Est',
  'Pays de la Loire',
  'Bretagne',
  'Normandie',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
];

// Navigation links
export const NAV_LINKS = [
  { href: '/shop', label: 'Produits' },
  { href: '/pack', label: 'Composer un Pack' },
  { href: '/subscribe', label: 'Abonnement' },
  { href: '/loyalty', label: 'Fidélité' },
  { href: '/blog', label: 'Blog' },
];

export const B2B_NAV_LINKS = [
  { href: '/fournisseurs', label: 'Accueil' },
  { href: '/fournisseurs/resources', label: 'Ressources' },
  { href: '/fournisseurs/order', label: 'Commander' },
  { href: '/fournisseurs/contact', label: 'Contact' },
];
