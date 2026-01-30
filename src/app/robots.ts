import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tamarque.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/account',
          '/cart',
          '/merci',
          '/fournisseurs/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/account',
          '/cart',
          '/merci',
          '/fournisseurs/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/blog/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-images.xml`,
      `${baseUrl}/sitemap-news.xml`,
    ],
    host: baseUrl,
  };
}
