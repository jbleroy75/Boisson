'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

/**
 * Hotjar Analytics Integration
 * - Heatmaps
 * - Session recordings
 * - Feedback polls
 * - Surveys
 *
 * Alternative: Microsoft Clarity (free, simpler)
 * Set NEXT_PUBLIC_CLARITY_ID to use Clarity instead
 */
export function Hotjar() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for analytics consent
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setHasConsent(parsed.analytics === true);
      } catch {
        setHasConsent(false);
      }
    }
  }, []);

  if (!HOTJAR_ID || !hasConsent) {
    return null;
  }

  return (
    <Script
      id="hotjar"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  );
}

/**
 * Microsoft Clarity (alternative to Hotjar - free)
 */
export function Clarity() {
  const [hasConsent, setHasConsent] = useState(false);
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setHasConsent(parsed.analytics === true);
      } catch {
        setHasConsent(false);
      }
    }
  }, []);

  if (!clarityId || !hasConsent) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${clarityId}");
        `,
      }}
    />
  );
}

// Hotjar tracking functions
export const hotjarTrack = {
  // Identify user (for authenticated users)
  identify: (userId: string, attributes?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('identify', userId, attributes);
    }
  },

  // Track virtual pageview
  stateChange: (path: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('stateChange', path);
    }
  },

  // Trigger a feedback poll
  trigger: (pollName: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('trigger', pollName);
    }
  },

  // Tag the current recording
  tagRecording: (tags: string[]) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('tagRecording', tags);
    }
  },

  // Track custom event
  event: (eventName: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('event', eventName);
    }
  },
};

// Clarity tracking functions
export const clarityTrack = {
  // Set custom tags
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, value);
    }
  },

  // Identify user
  identify: (customId: string, customSessionId?: string, customPageId?: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', customId, customSessionId, customPageId);
    }
  },

  // Mark page as upgraded (e.g., after conversion)
  upgrade: (reason: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('upgrade', reason);
    }
  },

  // Log custom event
  event: (eventName: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }
  },
};

// Type declarations
declare global {
  interface Window {
    hj?: (command: string, ...args: unknown[]) => void;
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}
