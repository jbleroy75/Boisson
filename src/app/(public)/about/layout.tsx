import { Metadata } from 'next';
import Script from 'next/script';
import { getStaticPageMetadata } from '@/lib/seo';
import { generateLocalBusinessSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = getStaticPageMetadata('about');

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      {children}
    </>
  );
}
