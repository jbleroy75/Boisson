import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('cgv');

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
