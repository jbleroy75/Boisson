'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { FacebookPixel } from '@/components/analytics/FacebookPixel';
import { Hotjar } from '@/components/analytics/Hotjar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SessionProvider>
          <CartProvider>
            {children}
            <ToastProvider />
            <CookieBanner />
            <Suspense fallback={null}>
              <GoogleAnalytics />
              <FacebookPixel />
              <Hotjar />
            </Suspense>
          </CartProvider>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
