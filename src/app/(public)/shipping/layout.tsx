import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('shipping');

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
