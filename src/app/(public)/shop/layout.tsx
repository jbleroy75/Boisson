import { Metadata } from 'next';
import Script from 'next/script';
import { getStaticPageMetadata } from '@/lib/seo';
import { generateItemListSchema, generateWebsiteSchema } from '@/lib/seo/schemas';
import { MOCK_PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = getStaticPageMetadata('shop');

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate product list schema for the shop page
  const itemListSchema = generateItemListSchema(MOCK_PRODUCTS, 'Boissons Protéinées Tamarque');
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <Script
        id="shop-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {children}
    </>
  );
}
