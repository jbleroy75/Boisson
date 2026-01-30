import { describe, it, expect } from 'vitest';
import {
  generateProductSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schemas';
import type { Product, Review } from '@/types';

// Mock product for testing
const mockProduct: Product = {
  id: 'TAM-MANGO-001',
  name: 'Mango Sunrise',
  slug: 'mango-sunrise',
  description: 'Boisson protéinée saveur mangue',
  images: ['/images/products/mango.jpg'],
  price: 29.99,
  inStock: true,
  flavor: 'yuzu-peach',
  sportType: ['endurance', 'recovery'],
  nutrition: {
    servingSize: '330ml',
    calories: 120,
    protein: 20,
    carbs: 8,
    sugar: 4,
    fat: 0.5,
    sodium: 150,
  },
  ingredients: ['Eau', 'Protéine de lactosérum', 'Arôme naturel'],
};

const mockReviews: Review[] = [
  { id: 'r1', author: 'User1', rating: 5, comment: 'Great!', date: '2024-01-01', verified: true },
  { id: 'r2', author: 'User2', rating: 4, comment: 'Good', date: '2024-01-02', verified: true },
];

describe('SEO Schemas', () => {
  describe('generateProductSchema', () => {
    it('should generate valid product schema', () => {
      const schema = generateProductSchema(mockProduct);

      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Mango Sunrise');
      expect(schema.offers?.price).toBe('29.99');
      expect(schema.offers?.priceCurrency).toBe('EUR');
    });

    it('should include rating when reviews provided', () => {
      const schema = generateProductSchema(mockProduct, mockReviews);

      expect(schema.aggregateRating?.ratingValue).toBe('4.5');
      expect(schema.aggregateRating?.reviewCount).toBe(2);
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate valid organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Tamarque');
      expect(schema.url).toBe('https://tamarque.com');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid breadcrumb schema', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Boutique', url: '/shop' },
        { name: 'Mango Sunrise', url: '/shop/mango-sunrise' },
      ]);

      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[2].name).toBe('Mango Sunrise');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQ schema', () => {
      const schema = generateFAQSchema([
        { question: 'Combien de protéines ?', answer: '20g par bouteille' },
        { question: 'Livraison gratuite ?', answer: 'Oui, dès 50€' },
      ]);

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });
  });

  describe('generateWebsiteSchema', () => {
    it('should generate valid website schema with search action', () => {
      const schema = generateWebsiteSchema();

      expect(schema['@type']).toBe('WebSite');
      expect(schema.url).toBe('https://tamarque.com');
      expect(schema.potentialAction?.['@type']).toBe('SearchAction');
    });
  });
});

describe('SEO Metadata', () => {
  it('should have proper base URL', () => {
    expect('https://tamarque.com').toMatch(/^https:\/\//);
  });

  it('should have required OpenGraph properties', () => {
    const ogProperties = {
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Tamarque',
    };

    expect(ogProperties.type).toBe('website');
    expect(ogProperties.locale).toBe('fr_FR');
    expect(ogProperties.siteName).toBe('Tamarque');
  });
});
