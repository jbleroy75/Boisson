'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS, FLAVOR_COLORS, PLACEHOLDER_IMAGES } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';
import { useCart } from '@/hooks/useCart';
import {
  SocialProofPopup,
  LiveVisitorCount,
  LowStockBadge,
  TrendingBadge,
  ViewingNowBadge,
  UrgencyBar,
  RecentSalesCount,
} from '@/components/shop/SocialProof';
import type { Product, SportType } from '@/types';

type SortOption = 'popularity' | 'name' | 'price-asc' | 'price-desc';

// Transform Shopify product to our Product type
function transformShopifyProduct(shopifyProduct: {
  id: string;
  handle: string;
  title: string;
  description: string;
  variants: Array<{ price: { amount: string }; compareAtPrice?: { amount: string } | null }>;
  images: Array<{ src: string }>;
}): Product {
  const variant = shopifyProduct.variants[0];
  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price: parseFloat(variant?.price?.amount || '0'),
    compareAtPrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
    images: shopifyProduct.images?.map((img) => img.src) || [],
    flavor: shopifyProduct.handle as Product['flavor'],
    sportType: ['endurance', 'recovery'] as SportType[],
    nutrition: {
      servingSize: '500ml',
      calories: 120,
      protein: 20,
      carbs: 8,
      sugar: 4,
      fat: 0,
      sodium: 150,
      caffeine: 100,
    },
    ingredients: ['Eau', 'Isolat de Whey', 'Caféine', 'Arômes naturels', 'Acide citrique', 'Stévia'],
    inStock: true,
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSportType, setSelectedSportType] = useState<SportType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  // Fetch products from Shopify
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const shopifyProducts = await getProducts();
        if (shopifyProducts && shopifyProducts.length > 0) {
          const transformed = shopifyProducts.map((p) =>
            transformShopifyProduct(p as unknown as Parameters<typeof transformShopifyProduct>[0])
          );
          setProducts(transformed);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedSportType !== 'all') {
      filtered = filtered.filter((p) => p.sportType.includes(selectedSportType));
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedSportType, sortBy]);

  return (
    <>
      <Header />
      <UrgencyBar />
      <main className="pt-16 md:pt-20 min-h-screen bg-[#FAFAFA]">
        {/* Hero Section - Immersive */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={PLACEHOLDER_IMAGES.gym}
              alt="Salle de sport"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Animated elements */}
          <div className="absolute top-20 right-20 w-64 h-64 border border-[#FF6B35]/30 rounded-full animate-rotate-slow opacity-50" />
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-[#00D9A5]/30 rounded-full animate-rotate-slow opacity-50" style={{ animationDirection: 'reverse' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm uppercase tracking-wider mb-8">
                  <span className="w-2 h-2 bg-[#00D9A5] rounded-full animate-pulse" />
                  Nouvelle Collection
                </span>

                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-none">
                  TROUVE TA
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF1493] to-[#00D9A5]">
                    SAVEUR
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl font-light leading-relaxed">
                  5 saveurs uniques. 20g de protéines. 80mg de caféine naturelle.
                  Une boisson prête à boire qui t&apos;accompagne partout.
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-6 md:gap-10">
                  {[
                    { value: '5', label: 'Saveurs', color: '#FF6B35' },
                    { value: '20g', label: 'Protéines', color: '#00D9A5' },
                    { value: '80mg', label: 'Caféine', color: '#FF1493' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-4xl md:text-5xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-white/50 text-sm uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/40 text-xs uppercase tracking-widest">Découvrir</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
              >
                <div className="w-1.5 h-3 bg-white/50 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* USP Bar */}
        <section className="bg-[#0A0A0A] py-6 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
              {[
                { icon: '🥤', text: 'Prêt à boire' },
                { icon: '💪', text: '20g Protéines' },
                { icon: '⚡', text: 'Caféine naturelle' },
                { icon: '🌿', text: '100% Naturel' },
                { icon: '🚚', text: 'Livraison offerte dès 30€' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium uppercase tracking-wider">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
              <div>
                <span className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-semibold uppercase tracking-wider mb-4">
                  Nos produits
                </span>
                <h2 className="text-4xl md:text-5xl text-[#0A0A0A]">
                  LA COLLECTION
                </h2>
              </div>

              {/* Filter & View Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 lg:mt-0">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                    aria-label="Vue grille"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('large')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'large' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                    aria-label="Vue large"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="popularity">Popularité</option>
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {(['all', 'endurance', 'strength', 'recovery'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedSportType(type)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                    selectedSportType === type
                      ? 'bg-[#0A0A0A] text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {type === 'all' ? 'Toutes les saveurs' : type === 'endurance' ? 'Endurance' : type === 'strength' ? 'Force' : 'Récupération'}
                </button>
              ))}
            </div>

            {/* Results count + Social proof */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <LiveVisitorCount />
                <RecentSalesCount />
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-200 rounded-full" />
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#FF6B35] rounded-full animate-spin border-t-transparent" />
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* Product Grid */}
                <motion.div
                  key={viewMode + selectedSportType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>

                {filteredProducts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg mb-4">Aucun produit ne correspond à vos filtres.</p>
                    <button
                      onClick={() => setSelectedSportType('all')}
                      className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#E55A2B] transition-colors"
                    >
                      Voir tous les produits
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Pack Builder CTA */}
        <section className="py-16 md:py-24 bg-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF6B35]/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00D9A5]/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-semibold uppercase tracking-wider mb-6">
                  Personnalise
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                  COMPOSE TON
                  <span className="block text-[#FF6B35]">PACK</span>
                </h2>
                <p className="text-lg text-white/60 mb-8 font-light max-w-lg">
                  Choisis tes saveurs préférées et crée un pack sur-mesure.
                  Plus tu commandes, plus tu économises.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { qty: '6', discount: '-10%' },
                    { qty: '12', discount: '-15%' },
                    { qty: '24', discount: '-20%' },
                  ].map((pack) => (
                    <div key={pack.qty} className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-center">
                      <div className="text-2xl font-bold text-white">{pack.qty}</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">bouteilles</div>
                      <div className="text-[#00D9A5] font-bold mt-1">{pack.discount}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/pack"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF6B35] text-white font-bold uppercase tracking-wider hover:bg-[#E55A2B] transition-colors"
                >
                  Composer mon pack
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Pack Visual */}
              <div className="relative">
                <div className="grid grid-cols-3 gap-4">
                  {MOCK_PRODUCTS.slice(0, 6).map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 hover:border-[#FF6B35]/50 transition-colors"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-[#FF6B35] via-[#FF1493] to-[#00D9A5] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float delay-500" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm uppercase tracking-wider mb-8 rounded-full">
                Abonnement
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl mb-6">
                ÉCONOMISE
                <span className="block">JUSQU&apos;À 25%</span>
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
                Ne sois plus jamais à court. Livraison gratuite, annulation à tout moment,
                et accès anticipé aux nouvelles saveurs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#FF6B35] font-bold hover:bg-[#0A0A0A] hover:text-white transition-all uppercase tracking-wider rounded-lg"
                >
                  Découvrir les formules
                </Link>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold hover:bg-white/10 transition-all uppercase tracking-wider rounded-lg"
                >
                  Calculer mes économies
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Social Proof Popup - Fixed position notifications */}
      <SocialProofPopup />
    </>
  );
}

function ProductCard({ product, index, viewMode }: { product: Product; index: number; viewMode: 'grid' | 'large' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, false);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const flavorColor = FLAVOR_COLORS[product.flavor] || '#FF6B35';

  // Simulate stock based on product id hash
  const productHash = product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const simulatedStock = (productHash % 15) + 2; // 2-16 stock
  const isTrending = index < 2; // First 2 products are trending

  if (viewMode === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Link
          href={`/shop/${product.slug}`}
          className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div
            className="md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden"
            style={{ backgroundColor: flavorColor + '10' }}
          >
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              {isTrending && <TrendingBadge />}
              {product.compareAtPrice && (
                <span className="px-4 py-2 bg-[#FF6B35] text-white text-sm font-bold uppercase tracking-wider rounded-full">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Low Stock Badge */}
            <div className="absolute top-6 right-6">
              <LowStockBadge stock={simulatedStock} />
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.sportType.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#FF6B35] transition-colors">
              {product.name}
            </h3>

            <p className="text-gray-500 mb-6 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Nutrition badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-semibold rounded-full">
                {product.nutrition.protein}g protéines
              </span>
              <span className="px-3 py-1.5 bg-[#00D9A5]/10 text-[#00D9A5] text-sm font-semibold rounded-full">
                {product.nutrition.calories} kcal
              </span>
              <span className="px-3 py-1.5 bg-[#FF1493]/10 text-[#FF1493] text-sm font-semibold rounded-full">
                80mg caféine
              </span>
            </div>

            {/* Viewing now */}
            <div className="mb-6">
              <ViewingNowBadge productId={product.id} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#0A0A0A]">{product.price.toFixed(2)}€</span>
                {product.compareAtPrice && (
                  <span className="text-gray-400 line-through text-lg">
                    {product.compareAtPrice.toFixed(2)}€
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="px-6 py-3 bg-[#0A0A0A] text-white font-semibold rounded-full hover:bg-[#FF6B35] transition-colors disabled:opacity-75"
              >
                {isAdding ? '✓ Ajouté' : 'Ajouter'}
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div
          className="aspect-[4/5] relative overflow-hidden"
          style={{ backgroundColor: flavorColor + '10' }}
        >
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-white text-[#0A0A0A] py-3.5 font-semibold text-sm uppercase tracking-wider hover:bg-[#FF6B35] hover:text-white transition-colors disabled:opacity-75 rounded-xl"
            >
              {isAdding ? '✓ Ajouté !' : 'Ajouter au panier'}
            </button>
          </motion.div>

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {isTrending && <TrendingBadge />}
            {!isTrending && product.sportType.slice(0, 1).map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider rounded-full"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Discount badge or Low Stock */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {product.compareAtPrice && (
              <span className="px-3 py-1.5 bg-[#FF6B35] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
            <LowStockBadge stock={simulatedStock} />
          </div>

          {/* Nutrition quick badge */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-0 transition-opacity">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold rounded-full">
                {product.nutrition.protein}g prot
              </span>
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold rounded-full">
                80mg caféine
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-bold text-lg mb-1 group-hover:text-[#FF6B35] transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-1 font-light">{product.description}</p>

          {/* Viewing now badge */}
          <div className="mb-3">
            <ViewingNowBadge productId={product.id} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[#0A0A0A] font-bold text-xl">{product.price.toFixed(2)}€</span>
              {product.compareAtPrice && (
                <span className="text-gray-400 line-through text-sm">
                  {product.compareAtPrice.toFixed(2)}€
                </span>
              )}
            </div>

            {/* Nutrition pills */}
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-[#00D9A5]/10 text-[#00D9A5] text-[10px] font-bold rounded-full">
                {product.nutrition.protein}g
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
