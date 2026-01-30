import { Metadata } from 'next';
import Script from 'next/script';
import { getStaticPageMetadata } from '@/lib/seo';
import { generateSubscriptionSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = getStaticPageMetadata('subscribe');

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscriptionSchema = generateSubscriptionSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Abonnement', url: '/subscribe' },
  ]);

  return (
    <>
      <Script
        id="subscription-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(subscriptionSchema),
        }}
      />
      <Script
        id="subscribe-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
