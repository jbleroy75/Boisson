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

// Mock products data (until Shopify is connected)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'yuzu-peach',
    name: 'Yuzu Peach',
    description: 'A refreshing blend of Japanese yuzu citrus and sweet peach. Light, tangy, and perfect for post-workout recovery.',
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
    ingredients: ['Water', 'Whey Protein Isolate', 'Natural Yuzu Extract', 'Peach Puree', 'Citric Acid', 'Stevia', 'Natural Flavors'],
    inStock: true,
  },
  {
    id: '2',
    slug: 'hibiscus-raspberry',
    name: 'Hibiscus Raspberry',
    description: 'Floral hibiscus meets tart raspberry in this antioxidant-rich blend. Deep flavor, zero bloating.',
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
    ingredients: ['Water', 'Whey Protein Isolate', 'Hibiscus Extract', 'Raspberry Puree', 'Citric Acid', 'Stevia', 'Natural Flavors'],
    inStock: true,
  },
  {
    id: '3',
    slug: 'matcha-vanilla',
    name: 'Matcha Vanilla',
    description: 'Premium Japanese matcha with smooth vanilla. Natural caffeine boost with sustained energy release.',
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
    ingredients: ['Water', 'Whey Protein Isolate', 'Ceremonial Grade Matcha', 'Vanilla Extract', 'Citric Acid', 'Stevia', 'Natural Flavors'],
    inStock: true,
  },
  {
    id: '4',
    slug: 'coco-pineapple',
    name: 'Coco Pineapple',
    description: 'Tropical paradise in a bottle. Coconut water base with fresh pineapple for ultimate hydration.',
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
    ingredients: ['Coconut Water', 'Whey Protein Isolate', 'Pineapple Puree', 'Citric Acid', 'Stevia', 'Natural Flavors'],
    inStock: true,
  },
  {
    id: '5',
    slug: 'dragon-fruit-mango-passion',
    name: 'Dragon Fruit Mango Passion',
    description: 'Exotic trio of dragon fruit, mango, and passion fruit. Vibrant pink color, tropical taste sensation.',
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
    ingredients: ['Water', 'Whey Protein Isolate', 'Dragon Fruit Puree', 'Mango Puree', 'Passion Fruit Extract', 'Citric Acid', 'Stevia', 'Natural Flavors'],
    inStock: true,
  },
];

// Subscription tiers
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    bottles: 12,
    discount: 15,
    price: 40.69,
    features: [
      '12 bottles per month',
      '15% off retail price',
      'Free shipping',
      'Cancel anytime',
    ],
  },
  {
    id: 'athlete',
    name: 'Athlete',
    bottles: 24,
    discount: 20,
    price: 76.61,
    features: [
      '24 bottles per month',
      '20% off retail price',
      'Free shipping',
      'Early access to new flavors',
      'Cancel anytime',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    bottles: 48,
    discount: 25,
    price: 143.64,
    features: [
      '48 bottles per month',
      '25% off retail price',
      'Free priority shipping',
      'Early access to new flavors',
      'Exclusive merchandise',
      'Cancel anytime',
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

// Mock reviews
export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    comment: 'Finally a protein drink that doesn\'t feel like drinking a milkshake! The ice tea texture is amazing and the Yuzu Peach flavor is addictive.',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    author: 'Marcus T.',
    rating: 5,
    comment: 'I train twice a day and these are perfect. No bloating, great taste, and I actually look forward to my protein intake now.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    author: 'Emma L.',
    rating: 4,
    comment: 'The Matcha Vanilla gives me the perfect energy boost before my morning runs. Love that it\'s all natural ingredients.',
    date: '2024-01-08',
    verified: true,
  },
  {
    id: '4',
    author: 'David K.',
    rating: 5,
    comment: 'Switched from traditional protein shakes and never looking back. The Dragon Fruit flavor is incredible!',
    date: '2024-01-05',
    verified: true,
  },
  {
    id: '5',
    author: 'Lisa R.',
    rating: 5,
    comment: 'As a triathlete, I need something light that won\'t weigh me down. Tamarque is exactly what I\'ve been looking for.',
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
  { href: '/fournisseurs', label: 'Home' },
  { href: '/fournisseurs/resources', label: 'Resources' },
  { href: '/fournisseurs/order', label: 'Order' },
  { href: '/fournisseurs/contact', label: 'Contact' },
];
