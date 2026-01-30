'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'PageView');
  }, [pathname]);

  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke');
            fbq('init', '${FB_PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Facebook Pixel tracking functions
export const fbTrack = {
  viewContent: (product: { id: string; name: string; price: number }) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'EUR',
    });
  },

  addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * product.quantity,
      currency: 'EUR',
    });
  },

  initiateCheckout: (total: number, productIds: string[]) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'InitiateCheckout', {
      content_ids: productIds,
      content_type: 'product',
      value: total,
      currency: 'EUR',
    });
  },

  purchase: (orderId: string, total: number, productIds: string[]) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'Purchase', {
      content_ids: productIds,
      content_type: 'product',
      value: total,
      currency: 'EUR',
      order_id: orderId,
    });
  },

  lead: (email?: string) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'Lead', {
      content_name: 'Newsletter Signup',
      ...(email && { email }),
    });
  },

  subscribe: (value: number) => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'Subscribe', {
      value,
      currency: 'EUR',
    });
  },
};
