'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// E-commerce tracking functions
export const trackEvent = {
  viewItem: (product: { id: string; name: string; price: number }) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_item', {
      currency: 'EUR',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    });
  },

  addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'add_to_cart', {
      currency: 'EUR',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity
      }],
    });
  },

  beginCheckout: (total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'begin_checkout', {
      currency: 'EUR',
      value: total,
      items: items.map(i => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
    });
  },

  purchase: (orderId: string, total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'purchase', {
      transaction_id: orderId,
      currency: 'EUR',
      value: total,
      items: items.map(i => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
    });
  },

  signUp: (method: string) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'sign_up', { method });
  },

  login: (method: string) => {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'login', { method });
  },
};
