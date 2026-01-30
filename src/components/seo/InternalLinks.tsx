'use client';

import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/constants';

/**
 * Related Products Component
 * Displays related products for internal linking (SEO benefit)
 */
export function RelatedProducts({
  currentProductId,
  maxItems = 4,
  className = '',
}: {
  currentProductId?: string;
  maxItems?: number;
  className?: string;
}) {
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== currentProductId
  ).slice(0, maxItems);

  if (relatedProducts.length === 0) return null;

  return (
    <nav aria-label="Produits similaires" className={className}>
      <h3 className="text-lg font-semibold mb-4">Vous aimerez aussi</h3>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <li key={product.id}>
            <Link
              href={`/shop/${product.slug}`}
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-sm">{product.name}</span>
              <span className="block text-xs text-gray-500 mt-1">
                {product.nutrition.protein}g protéines
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Blog Related Articles Component
 */
export function RelatedArticles({
  currentSlug,
  articles,
  maxItems = 3,
  className = '',
}: {
  currentSlug?: string;
  articles: { slug: string; title: string; category: string }[];
  maxItems?: number;
  className?: string;
}) {
  const relatedArticles = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, maxItems);

  if (relatedArticles.length === 0) return null;

  return (
    <nav aria-label="Articles similaires" className={className}>
      <h3 className="text-lg font-semibold mb-4">Articles connexes</h3>
      <ul className="space-y-3">
        {relatedArticles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-[#FF6B35] text-xs font-medium uppercase">
                {article.category}
              </span>
              <span className="font-medium text-sm leading-tight">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Footer SEO Links Component
 * Important internal links for crawlers
 */
export function FooterSEOLinks() {
  const linkGroups = [
    {
      title: 'Produits',
      links: [
        { href: '/shop', label: 'Boutique' },
        { href: '/pack', label: 'Composer un pack' },
        { href: '/subscribe', label: 'Abonnement' },
        ...MOCK_PRODUCTS.slice(0, 3).map((p) => ({
          href: `/shop/${p.slug}`,
          label: p.name,
        })),
      ],
    },
    {
      title: 'Informations',
      links: [
        { href: '/about', label: 'Notre histoire' },
        { href: '/blog', label: 'Blog nutrition' },
        { href: '/faq', label: 'Questions fréquentes' },
        { href: '/contact', label: 'Contact' },
        { href: '/loyalty', label: 'Programme fidélité' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { href: '/cgv', label: 'Conditions générales' },
        { href: '/privacy', label: 'Confidentialité' },
        { href: '/mentions-legales', label: 'Mentions légales' },
        { href: '/shipping', label: 'Livraison' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {linkGroups.map((group) => (
        <nav key={group.title} aria-label={group.title}>
          <h4 className="font-semibold mb-3">{group.title}</h4>
          <ul className="space-y-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-[#FF6B35] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}

/**
 * Contextual Links Component
 * For embedding relevant links within content
 */
export function ContextualLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#FF6B35] hover:underline"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="text-[#FF6B35] hover:underline">
      {children}
    </Link>
  );
}

/**
 * Quick Navigation Component
 * For blog articles or long pages
 */
export function QuickNavigation({
  sections,
  className = '',
}: {
  sections: { id: string; title: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Navigation rapide" className={`${className}`}>
      <h4 className="font-semibold mb-2 text-sm uppercase text-gray-500">
        Dans cet article
      </h4>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-gray-600 hover:text-[#FF6B35] transition-colors"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default RelatedProducts;
