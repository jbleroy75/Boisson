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

/**
 * HowTo Schema for recipe/tutorial articles
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  steps: { name: string; text: string; image?: string }[];
  tools?: string[];
  supplies?: { name: string; quantity?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    image: howTo.image,
    totalTime: howTo.totalTime,
    tool: howTo.tools?.map((tool) => ({
      '@type': 'HowToTool',
      name: tool,
    })),
    supply: howTo.supplies?.map((supply) => ({
      '@type': 'HowToSupply',
      name: supply.name,
      requiredQuantity: supply.quantity,
    })),
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}

/**
 * Recipe Schema for food/drink recipes
 */
export function generateRecipeSchema(recipe: {
  name: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  nutrition?: {
    calories?: string;
    proteinContent?: string;
    carbohydrateContent?: string;
    fatContent?: string;
  };
  recipeIngredient: string[];
  recipeInstructions: { text: string }[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    author: {
      '@type': 'Person',
      name: recipe.author,
    },
    datePublished: recipe.datePublished,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeYield: recipe.recipeYield,
    recipeCategory: recipe.recipeCategory,
    recipeCuisine: recipe.recipeCuisine,
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          ...recipe.nutrition,
        }
      : undefined,
    recipeIngredient: recipe.recipeIngredient,
    recipeInstructions: recipe.recipeInstructions.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step.text,
    })),
    aggregateRating: recipe.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: recipe.aggregateRating.ratingValue,
          reviewCount: recipe.aggregateRating.reviewCount,
        }
      : undefined,
  };
}

/**
 * VideoObject Schema
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 duration
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Tamarque',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo.png`,
      },
    },
  };
}

/**
 * Review Schema (standalone for testimonials)
 */
export function generateReviewSchema(review: {
  itemReviewed: {
    type: 'Product' | 'Organization' | 'Brand';
    name: string;
  };
  author: string;
  reviewBody: string;
  reviewRating: number;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating,
      bestRating: '5',
      worstRating: '1',
    },
    datePublished: review.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Tamarque',
    },
  };
}

/**
 * Aggregate Rating Schema (standalone for brand/company)
 */
export function generateAggregateRatingSchema(rating: {
  itemReviewed: {
    type: 'Organization' | 'Brand' | 'Product';
    name: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': rating.itemReviewed.type,
      name: rating.itemReviewed.name,
    },
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: rating.bestRating || 5,
    worstRating: rating.worstRating || 1,
  };
}

/**
 * Sale Event Schema
 */
export function generateSaleEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
  image?: string;
  offers?: {
    name: string;
    price: number;
    priceCurrency: string;
    discount?: string;
  }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SaleEvent',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    url: event.url || SITE_URL,
    image: event.image,
    location: {
      '@type': 'VirtualLocation',
      url: SITE_URL,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Tamarque',
      url: SITE_URL,
    },
    offers: event.offers?.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      price: offer.price.toFixed(2),
      priceCurrency: offer.priceCurrency,
      availability: 'https://schema.org/InStock',
      validFrom: event.startDate,
      validThrough: event.endDate,
    })),
  };
}

/**
 * Special Offer Schema
 */
export function generateSpecialOfferSchema(offer: {
  name: string;
  description: string;
  discount: string; // e.g., "25%" or "10€"
  validFrom: string;
  validThrough: string;
  eligibleProducts?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: offer.name,
    description: offer.description,
    priceSpecification: {
      '@type': 'PriceSpecification',
      discount: offer.discount,
    },
    validFrom: offer.validFrom,
    validThrough: offer.validThrough,
    eligibleRegion: {
      '@type': 'Country',
      name: 'France',
    },
    seller: {
      '@type': 'Organization',
      name: 'Tamarque',
    },
  };
}

/**
 * Subscription Service Schema
 */
export function generateSubscriptionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/subscribe#subscription`,
    name: 'Abonnement Tamarque',
    description: 'Recevez vos boissons protéinées préférées automatiquement avec 15-25% de réduction',
    provider: {
      '@type': 'Organization',
      name: 'Tamarque',
    },
    serviceType: 'Subscription Box',
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Pack Starter',
        description: '6 bouteilles par mois',
        price: '25.50',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pack Athlete',
        description: '12 bouteilles par mois',
        price: '48.00',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pack Team',
        description: '24 bouteilles par mois',
        price: '90.00',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    ],
  };
}
