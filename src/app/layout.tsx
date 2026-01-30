import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { OrganizationSchema } from '@/components/seo/StructuredData';
import { generateWebsiteSchema, generateAggregateRatingSchema } from '@/lib/seo/schemas';
import { Analytics } from '@vercel/analytics/next';

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
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
    default: 'Tamarque | Boisson Protéinée et Énergisante',
    template: '%s | Tamarque',
  },
  description:
    'Tamarque : la boisson qui combine protéines et caféine naturelle. 20g de protéines, 80mg de caféine, 100% naturel. Prête à boire, comme un soda.',
  keywords: [
    'boisson protéinée',
    'boisson énergisante',
    'protéine caféine',
    'boisson sport',
    'récupération musculation',
    'whey isolate',
    'pré workout',
    'fitness',
    'crossfit',
    'boisson prête à boire',
  ],
  authors: [{ name: 'Tamarque' }],
  creator: 'Tamarque',
  metadataBase: new URL('https://tamarque.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tamarque.com',
    siteName: 'Tamarque',
    title: 'Tamarque | Boisson Protéinée et Énergisante',
    description:
      'La boisson qui combine protéines et caféine naturelle. 20g de protéines, 80mg de caféine, prête à boire.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tamarque - Boisson Protéinée et Énergisante',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamarque | Boisson Protéinée et Énergisante',
    description:
      'La boisson qui combine protéines et caféine naturelle. 20g de protéines, 80mg de caféine.',
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
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Structured Data */}
        <OrganizationSchema />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
        <Script
          id="aggregate-rating-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateAggregateRatingSchema({
                itemReviewed: { type: 'Brand', name: 'Tamarque' },
                ratingValue: 4.9,
                reviewCount: 1247,
              })
            ),
          }}
        />
      </head>
      <body className={`${bebasNeue.variable} ${outfit.variable} font-sans antialiased`}>
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
