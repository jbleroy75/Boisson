# Tamarque - Protein Drinks with Ice Tea Texture

A Next.js 15 e-commerce platform for Tamarque protein drinks, featuring both B2C and B2B functionality.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **E-commerce**: Shopify Storefront API
- **Auth**: NextAuth.js (Credentials + Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **CMS**: Sanity.io (Blog & Recipes)
- **Payments**: Stripe + Shopify Payments
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Shopify store with Storefront API access
- (Optional) Sanity.io project
- (Optional) Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tamarque.git
cd tamarque
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` with your API keys (see Environment Variables section below).

5. Set up Supabase database:
   - Go to your Supabase project SQL Editor
   - Run the SQL schema in `src/lib/supabase.ts` (see the commented section)

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# HubSpot (B2B CRM)
HUBSPOT_API_KEY=your-hubspot-key

# Mailchimp (Newsletter)
MAILCHIMP_API_KEY=your-mailchimp-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
```

## Project Structure

```
tamarque/
├── src/
│   ├── app/
│   │   ├── (public)/           # Main consumer-facing routes
│   │   │   ├── shop/           # Product listing
│   │   │   ├── shop/[slug]/    # Product detail
│   │   │   ├── subscribe/      # Subscription tiers
│   │   │   ├── account/        # Customer dashboard
│   │   │   └── blog/           # Blog listing & articles
│   │   ├── fournisseurs/       # B2B subdomain routes
│   │   │   ├── dashboard/      # Distributor dashboard
│   │   │   ├── order/          # B2B ordering
│   │   │   ├── resources/      # Marketing assets
│   │   │   └── contact/        # B2B contact form
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth.js endpoints
│   │   │   └── webhooks/       # Shopify/Stripe webhooks
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── ui/                 # Reusable UI components
│   │   ├── shop/               # Shop-specific components
│   │   └── b2b/                # B2B-specific components
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── supabase.ts         # Supabase client
│   │   ├── shopify.ts          # Shopify client
│   │   └── constants.ts        # App constants & mock data
│   └── types/
│       └── index.ts            # TypeScript definitions
├── public/
│   └── images/                 # Static assets
├── .env.local                  # Environment variables
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Features

### Main Site (www.tamarque.com)
- Homepage with hero, product showcase, USP sections
- Shop page with product grid, filters, sorting
- Product detail pages with nutrition info, reviews
- Subscription tiers with Shopify Subscriptions
- Customer authentication (email + Google)
- Customer dashboard (orders, subscriptions, profile)
- Blog with Sanity.io CMS

### B2B Portal (fournisseurs.tamarque.com)
- Distributor landing page
- Contact form with HubSpot integration
- Resources page (catalogs, marketing assets)
- Distributor dashboard
- Volume-based B2B ordering
- Invoice generation (PDF)

## Database Schema (Supabase)

### Tables
- `users` - User accounts (customers + distributors)
- `distributors` - B2B distributor profiles
- `b2b_orders` - B2B order records

See `src/lib/supabase.ts` for the complete SQL schema with RLS policies.

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Subdomain Configuration

Configure both domains in Vercel:
- `www.tamarque.com` → Main site
- `fournisseurs.tamarque.com` → B2B portal (same deployment, conditional routing)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:e2e     # Run Playwright E2E tests
```

## Design System

### Colors
- Orange (Energy): `#FF6B35`
- Green (Nature): `#00D9A5`
- Pink (Dragon Fruit): `#FF1493`
- Black: `#1A1A1A`

### Typography
- Headings: Montserrat Bold
- Body: Inter Regular

### Spacing
- Base unit: 8px (0.5rem increments)

## Testing

### Unit Tests (Jest + React Testing Library)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Create a pull request

## License

Proprietary - Tamarque SAS
