import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('loyalty');

export default function LoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
