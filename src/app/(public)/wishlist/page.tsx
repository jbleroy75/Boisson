'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Package,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { showToast } from '@/components/ui/Toast';
import type { Product } from '@/types';

// Mock wishlist data
const MOCK_WISHLIST = [
  {
    id: '1',
    name: 'Tamarque Mango Sunrise',
    slug: 'mango-sunrise',
    price: 3.5,
    originalPrice: 4.0,
    image: '/images/products/mango-sunrise.png',
    inStock: true,
    addedAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Tamarque Dragon Fruit Rush',
    slug: 'dragon-fruit-rush',
    price: 3.5,
    originalPrice: null,
    image: '/images/products/dragon-fruit-rush.png',
    inStock: true,
    addedAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Tamarque Citrus Energy',
    slug: 'citrus-energy',
    price: 3.5,
    originalPrice: null,
    image: '/images/products/citrus-energy.png',
    inStock: false,
    addedAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Tamarque Berry Boost',
    slug: 'berry-boost',
    price: 3.5,
    originalPrice: 4.0,
    image: '/images/products/berry-boost.png',
    inStock: true,
    addedAt: '2024-01-18',
  },
];

type WishlistItem = (typeof MOCK_WISHLIST)[0];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(MOCK_WISHLIST);
  const { addToCart: addToCartContext } = useCart();

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    showToast.success('Produit retiré de la wishlist');
  };

  const wishlistItemToProduct = (item: WishlistItem): Product => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    description: '',
    images: [item.image],
    inStock: item.inStock,
    flavor: 'yuzu-peach',
    sportType: ['endurance'],
    nutrition: {
      servingSize: '330ml',
      calories: 120,
      protein: 20,
      carbs: 8,
      sugar: 4,
      fat: 0.5,
      sodium: 150,
    },
    ingredients: [],
  });

  const addToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      showToast.error('Ce produit est actuellement en rupture de stock');
      return;
    }
    addToCartContext(wishlistItemToProduct(item), 1);
    showToast.cart(item.name);
  };

  const addAllToCart = () => {
    const inStockItems = wishlist.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      showToast.error('Aucun produit disponible en stock');
      return;
    }
    inStockItems.forEach((item) => {
      addToCartContext(wishlistItemToProduct(item), 1);
    });
    showToast.success(`${inStockItems.length} produit(s) ajouté(s) au panier`);
  };

  const shareWishlist = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma wishlist Tamarque',
          text: 'Découvre ma sélection de boissons protéinées Tamarque !',
          url,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast.success('Lien copié dans le presse-papier');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (wishlist.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Votre wishlist est vide
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Ajoutez vos produits favoris à votre wishlist pour les retrouver facilement
                et être notifié des promotions.
              </p>
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                <Package className="h-5 w-5" />
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Heart className="h-8 w-8 text-pink-500" />
                Ma Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} sauvegardé
                {wishlist.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={shareWishlist}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Partager
              </button>
              <button onClick={addAllToCart} className="btn-primary flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Tout ajouter au panier
              </button>
            </div>
          </div>

          {/* Wishlist grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex"
              >
                {/* Product image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center"
                >
                  <Package className="h-12 w-12 text-orange-400" />
                </Link>

                {/* Product info */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-orange-500">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ajouté le {formatDate(item.addedAt)}
                    </p>
                    {!item.inStock && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                        Rupture de stock
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                        item.inStock
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Retirer de la wishlist"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              Continuer mes achats
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Stock notification info */}
          <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Astuce :</strong> Activez les notifications pour être alerté
              lorsqu'un produit en rupture de stock redevient disponible ou bénéficie d'une
              promotion.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
