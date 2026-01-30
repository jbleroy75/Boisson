import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('cart');

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
