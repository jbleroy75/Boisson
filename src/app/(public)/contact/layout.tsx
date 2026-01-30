import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('contact');

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
