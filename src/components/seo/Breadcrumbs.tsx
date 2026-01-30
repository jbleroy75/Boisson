'use client';

import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo/schemas';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include home
  const allItems = [{ label: 'Accueil', href: '/' }, ...items];

  // Generate schema
  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: item.href,
  }));

  return (
    <>
      {/* JSON-LD Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(schemaItems)),
        }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Fil d'Ariane"
        className={`text-sm text-gray-500 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#FF6B35] transition-colors flex items-center"
                    aria-label="Retour à l'accueil"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : isLast ? (
                  <span className="text-gray-900 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#FF6B35] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {!isLast && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Generate breadcrumb items for common pages
 */
export function getProductBreadcrumbs(productName: string): BreadcrumbItem[] {
  return [
    { label: 'Boutique', href: '/shop' },
    { label: productName, href: '#' },
  ];
}

export function getBlogBreadcrumbs(articleTitle?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Blog', href: '/blog' }];
  if (articleTitle) {
    items.push({ label: articleTitle, href: '#' });
  }
  return items;
}

export function getAccountBreadcrumbs(section?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Mon Compte', href: '/account' }];
  if (section) {
    items.push({ label: section, href: '#' });
  }
  return items;
}

export default Breadcrumbs;
