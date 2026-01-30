import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Consistent trailing slashes
  trailingSlash: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@supabase/supabase-js'],
  },

  // Turbopack configuration (Next.js 16+ default)
  turbopack: {},

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // XSS Protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // HSTS - Force HTTPS (production only)
          ...(isDev
            ? []
            : [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]),
        ],
      },
      {
        // Prevent caching of API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Prevent caching of auth-related pages
        source: '/login',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/account/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/fournisseurs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Legacy URL redirects
      {
        source: '/produits',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/boutique',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/abonnement',
        destination: '/subscribe',
        permanent: true,
      },
      {
        source: '/fidelite',
        destination: '/loyalty',
        permanent: true,
      },
      // Force HTTPS in production
      ...(isDev
        ? []
        : [
            {
              source: '/:path*',
              has: [
                {
                  type: 'header' as const,
                  key: 'x-forwarded-proto',
                  value: 'http',
                },
              ],
              destination: 'https://tamarque.com/:path*',
              permanent: true,
            },
          ]),
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Disable source maps in production for security
    if (!isServer && !isDev) {
      config.devtool = false;
    }

    return config;
  },
};

export default nextConfig;
