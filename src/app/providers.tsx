'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { FacebookPixel } from '@/components/analytics/FacebookPixel';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <CartProvider>
          {children}
          <ToastProvider />
          <CookieBanner />
          <Suspense fallback={null}>
            <GoogleAnalytics />
            <FacebookPixel />
          </Suspense>
        </CartProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
