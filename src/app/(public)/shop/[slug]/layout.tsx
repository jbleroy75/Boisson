import { Metadata } from 'next';
import Script from 'next/script';
import { getProductBySlug, generateProductMetadata, getAllProductSlugs } from '@/lib/seo';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { MOCK_REVIEWS } from '@/lib/constants';
import { notFound } from 'next/navigation';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  return generateProductMetadata(product);
}

export function generateStaticParams() {
  return getAllProductSlugs();
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Generate schemas
  const productSchema = generateProductSchema(product, MOCK_REVIEWS);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Boutique', url: '/shop' },
    { name: product.name, url: `/shop/${product.slug}` },
  ]);

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <Script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
