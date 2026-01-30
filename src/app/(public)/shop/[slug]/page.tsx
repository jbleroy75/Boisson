'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MOCK_PRODUCTS, MOCK_REVIEWS, FLAVOR_COLORS } from '@/lib/constants';
import { getProductByHandle } from '@/lib/shopify';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

// Transform Shopify product to our Product type
function transformShopifyProduct(shopifyProduct: {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
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
    sportType: ['endurance', 'recovery'],
    nutrition: {
      servingSize: '500ml',
      calories: 120,
      protein: 20,
      carbs: 8,
      sugar: 4,
      fat: 0,
      sodium: 150,
    },
    ingredients: ['Water', 'Whey Protein Isolate', 'Natural Flavors', 'Citric Acid', 'Stevia'],
    inStock: true,
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        // Try to fetch from Shopify first
        const shopifyProduct = await getProductByHandle(slug);
        if (shopifyProduct) {
          const transformed = transformShopifyProduct(
            shopifyProduct as unknown as Parameters<typeof transformShopifyProduct>[0]
          );
          setProduct(transformed);
        } else {
          // Fall back to mock product
          const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
          setProduct(mockProduct || null);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        // Fall back to mock product
        const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
        setProduct(mockProduct || null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/shop" className="text-[#FF6B35] hover:underline">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-white">
        <ProductContent product={product} />
      </main>
      <Footer />
    </>
  );
}

function ProductContent({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, isSubscription);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  // Get flavor color with fallback
  const flavorColor = FLAVOR_COLORS[product.flavor] || '#FF6B35';

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF6B35]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#FF6B35]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div
              className="aspect-square rounded-3xl overflow-hidden mb-4"
              style={{ backgroundColor: flavorColor + '30' }}
            >
              <div className="h-full flex items-center justify-center">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-40 h-80 rounded-3xl shadow-2xl"
                  style={{ backgroundColor: flavorColor }}
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-[#FF6B35]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: flavorColor + '40' }}
                >
                  <div className="h-full flex items-center justify-center">
                    <div
                      className="w-6 h-12 rounded"
                      style={{ backgroundColor: flavorColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.sportType.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                >
                  {type}
                </span>
              ))}
              <span className="px-3 py-1 bg-[#00D9A5]/10 text-[#00D9A5] rounded-full text-sm font-medium">
                100% Natural
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#FF6B35]">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-gray-500">per bottle</span>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setIsSubscription(false)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  !isSubscription
                    ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">One-time purchase</div>
                    <div className="text-sm text-gray-500">${product.price.toFixed(2)} per bottle</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      !isSubscription ? 'border-[#FF6B35]' : 'border-gray-300'
                    }`}
                  >
                    {!isSubscription && <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsSubscription(true)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  isSubscription
                    ? 'border-[#00D9A5] bg-[#00D9A5]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Subscribe & Save 15%
                      <span className="px-2 py-0.5 bg-[#00D9A5] text-white text-xs rounded-full">
                        Best Value
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      ${(product.price * 0.85).toFixed(2)} per bottle, delivered monthly
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSubscription ? 'border-[#00D9A5]' : 'border-gray-300'
                    }`}
                  >
                    {isSubscription && <div className="w-3 h-3 rounded-full bg-[#00D9A5]" />}
                  </div>
                </div>
              </button>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-3 font-semibold min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-[#FF6B35] text-white rounded-xl font-semibold text-lg hover:bg-[#E55A2B] transition-colors disabled:opacity-75"
              >
                {isAdding ? (
                  'Added to Cart!'
                ) : (
                  <>
                    Add to Cart - $
                    {(product.price * quantity * (isSubscription ? 0.85 : 1)).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* USPs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: '🚚', text: 'Free shipping over $50' },
                { icon: '↩️', text: '30-day returns' },
                { icon: '🌿', text: '100% natural ingredients' },
                { icon: '💪', text: '20g protein per bottle' },
              ].map((usp, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{usp.icon}</span>
                  <span>{usp.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Ice Tea Texture */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Ice Tea Texture?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: '💧',
                title: 'Light & Refreshing',
                description: 'No thick, chalky consistency. Just smooth, refreshing hydration.',
              },
              {
                icon: '⚡',
                title: 'Fast Absorption',
                description: 'Whey protein isolate absorbs quickly for faster recovery.',
              },
              {
                icon: '🪶',
                title: 'Zero Bloating',
                description: "Easy on your stomach, even during intense workouts.",
              },
              {
                icon: '🍃',
                title: 'Natural Taste',
                description: 'Real fruit extracts for authentic, delicious flavors.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Nutrition Table */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Nutrition Facts</h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-sm text-gray-500 mb-4">
                  Serving Size: {product.nutrition.servingSize}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Calories', value: product.nutrition.calories, unit: '' },
                    { label: 'Protein', value: product.nutrition.protein, unit: 'g' },
                    { label: 'Carbohydrates', value: product.nutrition.carbs, unit: 'g' },
                    { label: 'Sugar', value: product.nutrition.sugar, unit: 'g' },
                    { label: 'Fat', value: product.nutrition.fat, unit: 'g' },
                    { label: 'Sodium', value: product.nutrition.sodium, unit: 'mg' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 border-b border-gray-200"
                    >
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-semibold">
                        {item.value}
                        {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Ingredients</h2>
              <div className="bg-[#00D9A5]/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌿</span>
                  <span className="font-semibold text-[#00D9A5]">100% Natural</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{product.ingredients.join(', ')}</p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-xl p-3">
                    <div className="text-xs text-gray-500">No Artificial</div>
                    <div className="font-semibold">Sweeteners</div>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <div className="text-xs text-gray-500">No Artificial</div>
                    <div className="font-semibold">Colors</div>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <div className="text-xs text-gray-500">No</div>
                    <div className="font-semibold">Preservatives</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500">4.9 ({MOCK_REVIEWS.length} reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-[#FFD700]' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{review.author}</span>
                  </div>
                  {review.verified && (
                    <span className="text-xs text-[#00D9A5] flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="block product-card bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div
                  className="h-40 flex items-center justify-center"
                  style={{ backgroundColor: (FLAVOR_COLORS[p.flavor] || '#FF6B35') + '30' }}
                >
                  <div
                    className="w-12 h-24 rounded-xl shadow-lg"
                    style={{ backgroundColor: FLAVOR_COLORS[p.flavor] || '#FF6B35' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-[#FF6B35] font-semibold">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
