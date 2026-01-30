import Script from 'next/script';
import { Product, Review } from '@/types';

// Organization schema for the company
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tamarque',
    url: 'https://tamarque.com',
    logo: 'https://tamarque.com/images/logo/logo.png',
    description: 'Boissons protéinées légères et rafraîchissantes - 20g de protéines, 100% naturel',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-XX-XX-XX-XX',
      contactType: 'customer service',
      availableLanguage: ['French', 'English'],
      areaServed: 'FR',
    },
    sameAs: [
      'https://instagram.com/tamarque',
      'https://tiktok.com/@tamarque',
      'https://facebook.com/tamarque',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product schema for individual products
export function ProductSchema({
  product,
  reviews,
}: {
  product: Product;
  reviews?: Review[];
}) {
  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || 'https://tamarque.com/images/placeholder.jpg',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Tamarque',
    },
    offers: {
      '@type': 'Offer',
      url: `https://tamarque.com/shop/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Tamarque',
      },
    },
    ...(product.nutrition && {
      nutrition: {
        '@type': 'NutritionInformation',
        calories: `${product.nutrition.calories} kcal`,
        proteinContent: `${product.nutrition.protein}g`,
        carbohydrateContent: `${product.nutrition.carbs}g`,
        fatContent: `${product.nutrition.fat}g`,
        sugarContent: `${product.nutrition.sugar}g`,
      },
    }),
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

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList schema
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://tamarque.com${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ schema
export function FAQSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
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

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Blog article schema
export function ArticleSchema({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
  url,
}: {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tamarque',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tamarque.com/images/logo/logo.png',
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tamarque.com${url}`,
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Local Business schema (if applicable)
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Tamarque',
    image: 'https://tamarque.com/images/logo/logo.png',
    '@id': 'https://tamarque.com',
    url: 'https://tamarque.com',
    telephone: '+33-1-XX-XX-XX-XX',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[Adresse]',
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
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
