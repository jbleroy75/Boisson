// ===========================================
// TAMARQUE - Type Definitions
// ===========================================

// User roles
export type UserRole = 'customer' | 'distributor' | 'admin';

// User from Supabase
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  created_at: string;
}

// Distributor profile
export interface Distributor {
  id: string;
  user_id: string;
  company_name: string;
  siret: string;
  region: string;
  billing_address: string | null;
  approved: boolean;
  created_at: string;
}

// B2B Order
export interface B2BOrder {
  id: string;
  distributor_id: string;
  items: B2BOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  invoice_url: string | null;
  created_at: string;
}

export interface B2BOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

// Product (from Shopify or mock)
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  flavor: FlavorType;
  sportType: SportType[];
  nutrition: NutritionFacts;
  ingredients: string[];
  inStock: boolean;
}

// Flavor types
export type FlavorType =
  | 'yuzu-peach'
  | 'hibiscus-raspberry'
  | 'matcha-vanilla'
  | 'coco-pineapple'
  | 'dragon-fruit-mango-passion';

// Sport types for filtering
export type SportType = 'endurance' | 'strength' | 'recovery';

// Nutrition facts
export interface NutritionFacts {
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  sodium: number;
  caffeine: number; // mg per serving
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription?: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Subscription tiers
export interface SubscriptionTier {
  id: string;
  name: string;
  bottles: number;
  discount: number;
  price: number;
  features: string[];
}

// Blog post (from Sanity)
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  heroImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
}

// Review
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productId?: string;
  avatar?: string;
  role?: string;
}

// B2B Contact form
export interface B2BContactForm {
  companyName: string;
  siret: string;
  estimatedVolume: string;
  region: string;
  email: string;
  phone: string;
  message: string;
}

// Volume pricing for B2B
export interface VolumePricing {
  minQuantity: number;
  maxQuantity: number | null;
  discountPercent: number;
}

// Pack Configurator
export interface PackConfig {
  id: string;
  name: string;
  size: 6 | 12 | 24;
  flavors: PackFlavor[];
  price: number;
  savings: number;
}

export interface PackFlavor {
  productId: string;
  quantity: number;
}

// Loyalty Program
export interface LoyaltyMember {
  userId: string;
  points: number;
  tier: LoyaltyTier;
  totalSpent: number;
  ordersCount: number;
  joinedAt: string;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeProduct' | 'freeShipping' | 'exclusive';
  value: number;
}

export const LOYALTY_TIERS: Record<LoyaltyTier, { minPoints: number; multiplier: number; perks: string[] }> = {
  bronze: {
    minPoints: 0,
    multiplier: 1,
    perks: ['1 point par € dépensé', 'Accès aux récompenses de base'],
  },
  silver: {
    minPoints: 500,
    multiplier: 1.5,
    perks: ['1.5 points par € dépensé', 'Livraison gratuite dès 30€', 'Accès early aux nouveautés'],
  },
  gold: {
    minPoints: 1500,
    multiplier: 2,
    perks: ['2 points par € dépensé', 'Livraison gratuite', 'Produits exclusifs', '-10% permanent'],
  },
  platinum: {
    minPoints: 5000,
    multiplier: 3,
    perks: ['3 points par € dépensé', 'Livraison express gratuite', 'Cadeaux anniversaire', '-15% permanent', 'Accès VIP events'],
  },
};

// NextAuth extended session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
