/**
 * SEO Library - Metadata and Schema Generation
 */

import type { Metadata } from 'next';
import { MOCK_PRODUCTS } from '../constants';
import type { Product } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tamarque.com';
const SITE_NAME = 'Tamarque';
const DEFAULT_DESCRIPTION = 'La première boisson protéinée avec une texture ice tea. 20g de protéines, 100% naturel, zéro ballonnement.';

/**
 * Base metadata that all pages inherit
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tamarque | Boisson Protéinée Texture Ice Tea',
    template: '%s | Tamarque',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'boisson protéinée',
    'protéine ice tea',
    'protéine naturelle',
    'boisson sport',
    'récupération musculation',
    'whey isolate',
    'protéine claire',
    'fitness',
    'crossfit',
  ],
  authors: [{ name: 'Tamarque' }],
  creator: 'Tamarque',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@tamarque',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo/apple-touch-icon.png',
  },
};

/**
 * Generate page metadata with defaults
 */
export function generatePageMetadata(options: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: 'website' | 'article';
}): Metadata {
  const url = options.path ? `${SITE_URL}${options.path}` : SITE_URL;
  const image = options.image || '/images/og-image.jpg';

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: {
      canonical: url,
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      type: options.type || 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      title: options.title,
      description: options.description,
      images: [image],
    },
  };
}

/**
 * Generate product metadata
 */
export function generateProductMetadata(product: Product): Metadata {
  const title = `${product.name} - Boisson Protéinée`;
  const description = product.description || `${product.name}: boisson protéinée texture ice tea avec ${product.nutrition.protein}g de protéines. 100% naturel, zéro ballonnement.`;
  const image = product.images?.[0] || '/images/og-product.jpg';

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      'boisson protéinée',
      'whey protein',
      'ice tea protéiné',
      ...(product.sportType || []),
    ],
    alternates: {
      canonical: `${SITE_URL}/shop/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/shop/${product.slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Generate blog article metadata
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
}): Metadata {
  return {
    title: article.title,
    description: article.description,
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `${SITE_URL}/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: article.author ? [article.author] : undefined,
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

/**
 * Get product by slug (for static params generation)
 */
export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

/**
 * Get all product slugs (for generateStaticParams)
 */
export function getAllProductSlugs(): { slug: string }[] {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

/**
 * Page metadata definitions for static pages
 */
export const PAGE_METADATA: Record<string, { title: string; description: string; keywords?: string[] }> = {
  home: {
    title: 'Boisson Protéinée Texture Ice Tea',
    description: 'La première boisson protéinée avec une texture ice tea. 20g de protéines, 100% naturel, zéro ballonnement. Enfin une boisson protéinée qu\'on a vraiment envie de boire.',
  },
  shop: {
    title: 'Nos Boissons Protéinées',
    description: 'Découvrez nos 5 saveurs exotiques de boissons protéinées. Ice tea texture, 20g de protéines, 100% naturel. Livraison gratuite dès 50€.',
    keywords: ['acheter boisson protéinée', 'shop protéine', 'boisson sport'],
  },
  pack: {
    title: 'Compose ton Pack',
    description: 'Créez votre pack personnalisé de boissons protéinées. Choisissez vos saveurs préférées et économisez jusqu\'à 20%.',
    keywords: ['pack protéine', 'box protéine', 'personnaliser'],
  },
  subscribe: {
    title: 'Abonnement Boissons Protéinées',
    description: 'Économisez jusqu\'à 25% avec un abonnement Tamarque. Livraison gratuite, sans engagement, annulez à tout moment.',
    keywords: ['abonnement protéine', 'livraison régulière', 'économies'],
  },
  loyalty: {
    title: 'Programme Fidélité',
    description: 'Gagnez des points à chaque achat et débloquez des récompenses exclusives. Montez de niveau pour des avantages VIP.',
    keywords: ['fidélité', 'points', 'récompenses', 'VIP'],
  },
  blog: {
    title: 'Blog Nutrition & Sport',
    description: 'Conseils nutrition, entraînement et bien-être. Articles par des experts pour optimiser vos performances.',
    keywords: ['blog nutrition', 'conseils sport', 'fitness'],
  },
  about: {
    title: 'Notre Histoire',
    description: 'Découvrez l\'histoire de Tamarque, née de la frustration des boissons protéinées épaisses et peu appétissantes.',
    keywords: ['histoire tamarque', 'marque protéine', 'qui sommes-nous'],
  },
  contact: {
    title: 'Contact',
    description: 'Une question ? Contactez l\'équipe Tamarque. Nous répondons sous 24h.',
    keywords: ['contact', 'support', 'aide'],
  },
  faq: {
    title: 'Questions Fréquentes',
    description: 'Retrouvez les réponses aux questions les plus fréquentes sur nos produits, livraisons, abonnements et programme fidélité.',
    keywords: ['FAQ', 'questions', 'aide', 'support'],
  },
  cgv: {
    title: 'Conditions Générales de Vente',
    description: 'Consultez les conditions générales de vente de Tamarque.',
  },
  privacy: {
    title: 'Politique de Confidentialité',
    description: 'Découvrez comment Tamarque protège vos données personnelles conformément au RGPD.',
  },
  'mentions-legales': {
    title: 'Mentions Légales',
    description: 'Mentions légales et informations sur l\'éditeur du site Tamarque.',
  },
  shipping: {
    title: 'Livraison',
    description: 'Informations sur les délais et frais de livraison Tamarque. Livraison gratuite dès 50€ en France.',
    keywords: ['livraison', 'délais', 'frais de port'],
  },
  cart: {
    title: 'Panier',
    description: 'Votre panier Tamarque',
  },
  account: {
    title: 'Mon Compte',
    description: 'Gérez votre compte Tamarque, commandes et abonnements.',
  },
  login: {
    title: 'Connexion',
    description: 'Connectez-vous à votre compte Tamarque.',
  },
};

/**
 * Generate static page metadata
 */
export function getStaticPageMetadata(page: keyof typeof PAGE_METADATA): Metadata {
  const data = PAGE_METADATA[page];
  if (!data) {
    return {};
  }

  const path = page === 'home' ? '' : `/${page}`;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path,
    keywords: data.keywords,
    noIndex: ['cart', 'account', 'login'].includes(page),
  });
}
