import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/lib/constants';

const baseUrl = 'https://tamarque.com';

// Mock blog posts - in production, fetch from Sanity
const BLOG_POSTS = [
  { slug: 'top-5-recettes-post-entrainement', publishedAt: '2024-01-20' },
  { slug: 'besoins-proteines-coureurs', publishedAt: '2024-01-15' },
  { slug: 'proteine-legere-revolution', publishedAt: '2024-01-10' },
  { slug: 'ingredients-naturels-performance', publishedAt: '2024-01-05' },
  { slug: 'guide-hydratation-ete', publishedAt: '2024-01-01' },
  { slug: 'mythes-proteines-demystifies', publishedAt: '2023-12-28' },
  { slug: 'routine-matinale-athlete', publishedAt: '2023-12-20' },
  { slug: 'crossfit-nutrition-guide', publishedAt: '2023-12-15' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${baseUrl}/images/hero/homepage-hero.jpg`],
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pack`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/loyalty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Product pages with images
  const productPages: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    images: product.images?.length
      ? product.images
      : [`${baseUrl}/images/products/${product.slug}.jpg`],
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
