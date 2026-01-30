/**
 * JSON-LD Schema Generators
 * Generate structured data for rich snippets
 */

import type { Product, Review } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tamarque.com';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Tamarque',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo/logo.png`,
      width: 600,
      height: 60,
    },
    description: 'Boissons protéinées texture ice tea - 20g de protéines, 100% naturel',
    foundingDate: '2024',
    sameAs: [
      'https://instagram.com/tamarque',
      'https://tiktok.com/@tamarque',
      'https://facebook.com/tamarque',
      'https://twitter.com/tamarque',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+33-1-XX-XX-XX-XX',
        contactType: 'customer service',
        availableLanguage: ['French', 'English'],
        areaServed: 'FR',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
  };
}

/**
 * Website Schema
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Tamarque',
    url: SITE_URL,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product Schema
 */
export function generateProductSchema(product: Product, reviews?: Review[]) {
  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/shop/${product.slug}#product`,
    name: product.name,
    description: product.description,
    image: product.images?.[0] || `${SITE_URL}/images/placeholder.jpg`,
    sku: product.id,
    mpn: `TM-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Tamarque',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Tamarque',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'd',
          },
        },
      },
    },
    nutrition: product.nutrition
      ? {
          '@type': 'NutritionInformation',
          servingSize: product.nutrition.servingSize,
          calories: `${product.nutrition.calories} calories`,
          proteinContent: `${product.nutrition.protein}g`,
          carbohydrateContent: `${product.nutrition.carbs}g`,
          sugarContent: `${product.nutrition.sugar}g`,
          fatContent: `${product.nutrition.fat}g`,
          sodiumContent: `${product.nutrition.sodium}mg`,
        }
      : undefined,
    ...(reviews?.length && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating?.toFixed(1),
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        datePublished: review.date,
        reviewBody: review.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }),
  };
}

/**
 * Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Article Schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tamarque',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo.png`,
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${SITE_URL}${article.url}`,
    },
  };
}

/**
 * Local Business Schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Tamarque',
    image: `${SITE_URL}/images/logo/logo.png`,
    url: SITE_URL,
    telephone: '+33-1-XX-XX-XX-XX',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Paris',
      addressLocality: 'Paris',
      postalCode: '75000',
      addressCountry: 'FR',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'EUR',
  };
}

/**
 * ItemList Schema for product collections
 */
export function generateItemListSchema(products: Product[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${SITE_URL}/shop/${product.slug}`,
        image: product.images?.[0],
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}

/**
 * Collection Page Schema
 */
export function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  products: Product[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    mainEntity: generateItemListSchema(products, title),
  };
}

/**
 * Combine multiple schemas into a single JSON-LD array
 */
export function combineSchemas(...schemas: object[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
