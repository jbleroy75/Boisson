/**
 * Preload Component for Critical Resources
 * Improves Core Web Vitals (LCP, FID)
 */

interface PreloadProps {
  fonts?: boolean;
  criticalImages?: string[];
  criticalStyles?: string[];
}

/**
 * Preload critical resources for better performance
 * Use in app/layout.tsx or page layouts
 */
export function PreloadResources({
  fonts = true,
  criticalImages = [],
  criticalStyles = [],
}: PreloadProps) {
  return (
    <>
      {/* Preload critical fonts */}
      {fonts && (
        <>
          <link
            rel="preload"
            href="/fonts/montserrat-var.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/inter-var.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* Preload critical images (LCP optimization) */}
      {criticalImages.map((src) => (
        <link key={src} rel="preload" href={src} as="image" />
      ))}

      {/* Preload critical styles */}
      {criticalStyles.map((href) => (
        <link key={href} rel="preload" href={href} as="style" />
      ))}

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />

      {/* Preconnect for critical third parties */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
    </>
  );
}

/**
 * Preload hints for specific page types
 */
export function PreloadProductPage({ productSlug }: { productSlug: string }) {
  return (
    <>
      <link
        rel="preload"
        href={`/images/products/${productSlug}.jpg`}
        as="image"
      />
      <link
        rel="preload"
        href={`/api/products/${productSlug}`}
        as="fetch"
        crossOrigin="anonymous"
      />
    </>
  );
}

export function PreloadHomePage() {
  return (
    <>
      <link rel="preload" href="/images/hero/homepage-hero.jpg" as="image" />
      <link rel="preload" href="/images/hero/homepage-hero.webp" as="image" />
    </>
  );
}

export default PreloadResources;
