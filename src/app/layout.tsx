import type { Metadata, Viewport } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { OrganizationSchema } from '@/components/seo/StructuredData';
import { Analytics } from '@vercel/analytics/next';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6B35',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: {
    default: 'Tamarque | Boisson Protéinée Texture Ice Tea',
    template: '%s | Tamarque',
  },
  description:
    'La première boisson protéinée avec une texture ice tea. 20g de protéines, 100% naturel, zéro ballonnement. Enfin une boisson protéinée qu\'on a vraiment envie de boire.',
  keywords: [
    'boisson protéinée',
    'protéine ice tea',
    'protéine naturelle',
    'boisson sport',
    'récupération musculation',
    'whey isolate',
    'protéine claire',
    'fitness',
    'crossfit',
  ],
  authors: [{ name: 'Tamarque' }],
  creator: 'Tamarque',
  metadataBase: new URL('https://tamarque.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tamarque.com',
    siteName: 'Tamarque',
    title: 'Tamarque | Boisson Protéinée Texture Ice Tea',
    description:
      'La première boisson protéinée avec une texture ice tea. 20g de protéines, 100% naturel, zéro ballonnement.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tamarque - Boissons Protéinées',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamarque | Boisson Protéinée Texture Ice Tea',
    description:
      'La première boisson protéinée avec une texture ice tea. 20g de protéines, 100% naturel.',
    images: ['/images/og-image.jpg'],
    creator: '@tamarque',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <OrganizationSchema />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}>
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Aller au contenu principal
        </a>

        <Providers>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
