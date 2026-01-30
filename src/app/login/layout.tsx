import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getStaticPageMetadata('login');

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
