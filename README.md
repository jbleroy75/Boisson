# Tamarque

Plateforme e-commerce Next.js pour Tamarque, marque de boissons proteinees avec texture ice tea.

## Stack Technique

| Categorie | Technologie |
|-----------|-------------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Framer Motion |
| E-commerce | Shopify Storefront API |
| Auth | NextAuth.js (Credentials + Google OAuth + 2FA) |
| Database | Supabase (PostgreSQL) |
| CMS | Sanity.io |
| Emails | Resend |
| Payments | Stripe + Shopify Payments |
| Analytics | Hotjar + Microsoft Clarity |
| Deployment | Vercel |

## Fonctionnalites

### Site B2C (www.tamarque.com)

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Hero, produits, USP, temoignages |
| Boutique | `/shop` | Grille produits, filtres, tri |
| Produit | `/shop/[slug]` | Detail, nutrition, avis |
| Panier | `/cart` | Gestion panier, codes promo |
| Abonnement | `/subscribe` | 3 formules avec reduction |
| Fidelite | `/loyalty` | Programme points, recompenses |
| Pack Builder | `/pack` | Configurateur de pack personnalise |
| Blog | `/blog` | Articles nutrition/fitness |
| Compte | `/account` | Dashboard, commandes, adresses |
| Parametres | `/account/settings` | Profil, notifications, securite |
| Wishlist | `/wishlist` | Produits favoris |
| FAQ | `/faq` | Questions frequentes |
| Contact | `/contact` | Formulaire de contact |

### Portail B2B (fournisseurs.tamarque.com)

| Page | Route | Description |
|------|-------|-------------|
| Accueil B2B | `/fournisseurs` | Landing page partenaires |
| Connexion | `/fournisseurs/login` | Auth separee B2B |
| Inscription | `/fournisseurs/inscription` | Formulaire partenariat |
| Dashboard | `/fournisseurs/dashboard` | KPIs, commandes recentes |
| Commandes | `/fournisseurs/orders` | Liste commandes, export CSV |
| Detail commande | `/fournisseurs/orders/[id]` | Timeline, tracking, articles |
| Factures | `/fournisseurs/invoices` | Liste factures, telechargement |
| Detail facture | `/fournisseurs/invoices/[id]` | Apercu, PDF, envoi email |
| Tarifs | `/fournisseurs/pricing` | Grille tarifaire par volume |
| Ressources | `/fournisseurs/resources` | Assets marketing |
| Contact B2B | `/fournisseurs/contact` | Formulaire dedie |

### Authentification

- Connexion email/mot de passe
- OAuth Google
- 2FA TOTP (Google Authenticator)
- Reset mot de passe par email
- Gestion sessions
- Rate limiting anti-brute force

### Emails (Resend)

| Email | Declencheur |
|-------|-------------|
| Bienvenue | Inscription |
| Newsletter | Abonnement newsletter |
| Reset password | Demande de reinitialisation |
| Contact confirmation | Formulaire contact |
| B2B inscription | Demande partenariat |
| B2B notification admin | Nouvelle demande B2B |
| B2B statut commande | Changement statut |

### Templates Shopify

Templates email personnalises dans `/shopify/email-templates/` :

- `order-confirmation.liquid` - Confirmation commande
- `shipping-confirmation.liquid` - Expedition
- `customer-account-welcome.liquid` - Bienvenue client
- `abandoned-cart.liquid` - Panier abandonne
- `customer-password-reset.liquid` - Reset mot de passe
- `order-refund.liquid` - Remboursement

### Securite

- Headers HTTP securises (CSP, HSTS, X-Frame-Options)
- Protection CSRF
- Rate limiting par IP
- Validation Zod sur toutes les entrees
- Sanitization XSS
- Audit logs

### Performance

- Images lazy loading avec Intersection Observer
- Optimisation bundle (tree shaking)
- Fonts optimisees (next/font)
- Cache headers

### Accessibilite

- WCAG 2.1 AA
- Navigation clavier
- Labels ARIA
- Contraste couleurs
- Reduced motion support

### Analytics

- Hotjar (heatmaps, recordings)
- Microsoft Clarity (alternative)
- Respect du consentement cookies

## Structure Projet

```
tamarque/
├── src/
│   ├── app/
│   │   ├── (public)/           # Routes B2C
│   │   ├── fournisseurs/       # Routes B2B
│   │   ├── api/                # API routes
│   │   └── login/              # Auth pages
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                 # Composants UI reutilisables
│   │   ├── shop/               # Composants shop
│   │   ├── b2b/                # Composants B2B
│   │   ├── auth/               # Composants auth (2FA)
│   │   ├── analytics/          # Hotjar, Clarity
│   │   └── newsletter/         # Newsletter signup
│   ├── contexts/
│   │   ├── CartContext.tsx     # Panier
│   │   └── ThemeContext.tsx    # Dark mode
│   ├── hooks/
│   │   └── useCart.ts          # Hook panier
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── supabase.ts         # Client Supabase
│   │   ├── shopify.ts          # Client Shopify
│   │   ├── stripe.ts           # Client Stripe
│   │   ├── sanity.ts           # Client Sanity
│   │   ├── email.ts            # Emails Resend
│   │   ├── pdf.ts              # Generation PDF
│   │   ├── csv.ts              # Export CSV
│   │   └── security/           # Utils securite
│   └── types/
│       └── index.ts            # Types TypeScript
├── shopify/
│   └── email-templates/        # Templates Liquid
├── e2e/                        # Tests Playwright
├── public/                     # Assets statiques
└── ...config files
```

## Installation

### Prerequis

- Node.js 18+
- npm ou yarn

### Setup

```bash
# Cloner le repo
git clone https://github.com/jbleroy75/Boisson.git
cd Boisson/tamarque

# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Editer .env.local avec vos cles API

# Lancer en developpement
npm run dev
```

### Variables d'environnement

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase (optionnel sans B2B)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=

# Stripe (optionnel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (emails)
RESEND_API_KEY=

# Sanity (blog, optionnel)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Analytics (optionnel)
NEXT_PUBLIC_HOTJAR_ID=
NEXT_PUBLIC_CLARITY_ID=
```

## Scripts

```bash
npm run dev          # Serveur developpement
npm run build        # Build production (avec --webpack flag)
npm run start        # Serveur production
npm run lint         # ESLint
npm run test         # Tests unitaires Vitest
npm run test:e2e     # Tests E2E Playwright
```

Note : Le build necessite le flag `--webpack` a cause d'un bug Turbopack :
```bash
npm run build -- --webpack
```

## Design System

### Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| Orange | `#FF6B35` | Primaire, CTA |
| Rose | `#FF1493` | Accent, gradients |
| Vert | `#00D9A5` | Succes, nature |
| Noir | `#1A1A1A` | Texte, footer |
| Or | `#FFD700` | Premium, fidelite |

### Typographie

- Titres : Montserrat Bold
- Corps : Inter Regular

### Dark Mode

Toggle dans le header. Persiste dans localStorage.

## Produits

5 saveurs disponibles :

1. Mango Sunrise
2. Dragon Fruit Rush
3. Citrus Energy
4. Tropical Storm
5. Berry Boost

Caracteristiques :
- 20g de proteines par bouteille
- Texture ice tea (pas de shake epais)
- Zero sucres ajoutes
- 100% naturel

## Cible

- Sportifs (crossfit, musculation)
- Fitness casual (salle 2-3x/semaine)
- Jeunes actifs urbains (25-35 ans)

## Deploiement

### Vercel

1. Connecter le repo GitHub a Vercel
2. Configurer les variables d'environnement
3. Deployer

### Domaines

- `tamarque.com` - Site principal B2C
- `fournisseurs.tamarque.com` - Portail B2B (meme deployment, routing conditionnel via middleware)

## TODO avant lancement

- [ ] Ajouter images produits et logo
- [ ] Creer les produits dans Shopify
- [ ] Configurer Shopify Payments
- [ ] Deployer sur Vercel
- [ ] Configurer domaines

## TODO optionnel

- [ ] Setup Supabase (pour B2B et fidelite)
- [ ] Setup Sanity.io (pour blog)
- [ ] Configurer Stripe webhooks (pour abonnements)
- [ ] Tests E2E complets

## Licence

Proprietary - Tamarque SAS
