'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS, FLAVOR_COLORS } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';
import { useCart } from '@/hooks/useCart';
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
    },
    ingredients: ['Water', 'Whey Protein Isolate', 'Natural Flavors'],
    inStock: true,
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSportType, setSelectedSportType] = useState<SportType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // Fetch products from Shopify
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const shopifyProducts = await getProducts();
        if (shopifyProducts && shopifyProducts.length > 0) {
          // Transform Shopify products to our format
          const transformed = shopifyProducts.map((p) =>
            transformShopifyProduct(p as unknown as Parameters<typeof transformShopifyProduct>[0])
          );
          setProducts(transformed);
        } else {
          // Fall back to mock products
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

    // Filter by sport type
    if (selectedSportType !== 'all') {
      filtered = filtered.filter((p) => p.sportType.includes(selectedSportType));
    }

    // Sort
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
        // popularity - keep original order
        break;
    }

    return filtered;
  }, [products, selectedSportType, sortBy]);

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-[#FF6B35] to-[#FF1493] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Flavors</h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                5 exotic flavors crafted for athletes. Ice tea texture, 20g protein, 100% natural.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              {/* Sport Type Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2 self-center">Filter:</span>
                {(['all', 'endurance', 'strength', 'recovery'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSportType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSportType === type
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="popularity">Popularity</option>
                  <option value="name">Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products match your filters.</p>
                    <button
                      onClick={() => setSelectedSportType('all')}
                      className="mt-4 text-[#FF6B35] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="py-16 bg-[#1A1A1A] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Save Up to 25% with a Subscription</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Never run out of your favorite protein drinks. Free shipping, cancel anytime.
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-[#FF6B35] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E55A2B] transition-colors"
            >
              View Subscription Plans
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product, 1, false);
    setTimeout(() => setIsAdding(false), 500);
  };

  // Get flavor color, fallback to orange if not found
  const flavorColor = FLAVOR_COLORS[product.flavor] || '#FF6B35';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div
          className="h-64 relative overflow-hidden"
          style={{ backgroundColor: flavorColor + '30' }}
        >
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1, rotate: isHovered ? -3 : -6 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-20 h-40 rounded-2xl shadow-lg"
              style={{ backgroundColor: flavorColor }}
            />
          </motion.div>

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A2B] transition-colors disabled:opacity-75"
            >
              {isAdding ? 'Added!' : 'Quick Add'}
            </button>
          </motion.div>

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.sportType.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[#FF6B35] font-bold text-xl">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Nutrition quick info */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="font-semibold text-[#00D9A5]">{product.nutrition.protein}g</span>
              <span>protein</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
