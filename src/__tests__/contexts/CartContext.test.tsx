import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test product
const mockProduct: Product = {
  id: 'test-product-1',
  name: 'Test Product',
  slug: 'test-product',
  price: 3.5,
  description: 'A test product',
  images: ['/test.png'],
  inStock: true,
  flavor: 'mango-sunrise',
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
  ingredients: ['water', 'protein'],
};

const mockProduct2: Product = {
  ...mockProduct,
  id: 'test-product-2',
  name: 'Test Product 2',
  slug: 'test-product-2',
  price: 4.0,
};

// Wrapper for rendering hooks with CartProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes with empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.itemCount).toBe(0);
      expect(result.current.subtotal).toBe(0);
      expect(result.current.total).toBe(0);
      expect(result.current.checkoutId).toBeNull();
    });

    it('throws error when used outside provider', () => {
      // Suppress console error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('addToCart', () => {
    it('adds product to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe('test-product-1');
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.itemCount).toBe(1);
    });

    it('adds product with specified quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.items[0].quantity).toBe(3);
      expect(result.current.itemCount).toBe(3);
    });

    it('increments quantity when adding same product', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.itemCount).toBe(5);
    });

    it('treats subscription and non-subscription as separate items', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1, false);
      });

      act(() => {
        result.current.addToCart(mockProduct, 1, true);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].isSubscription).toBeFalsy();
      expect(result.current.items[1].isSubscription).toBe(true);
    });
  });

  describe('removeFromCart', () => {
    it('removes product from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1);
        result.current.addToCart(mockProduct2, 1);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.removeFromCart('test-product-1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe('test-product-2');
    });

    it('does nothing when removing non-existent product', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      act(() => {
        result.current.removeFromCart('non-existent-id');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates product quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.itemCount).toBe(5);
    });

    it('removes product when quantity is set to 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('removes product when quantity is negative', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2);
        result.current.addToCart(mockProduct2, 3);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.itemCount).toBe(0);
      expect(result.current.subtotal).toBe(0);
      expect(result.current.checkoutId).toBeNull();
    });
  });

  describe('setCheckoutId', () => {
    it('sets checkout ID', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.setCheckoutId('checkout-123');
      });

      expect(result.current.checkoutId).toBe('checkout-123');
    });
  });

  describe('calculations', () => {
    it('calculates subtotal correctly', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2); // 3.5 * 2 = 7
        result.current.addToCart(mockProduct2, 3); // 4.0 * 3 = 12
      });

      expect(result.current.subtotal).toBe(19); // 7 + 12
    });

    it('calculates subscription discount correctly', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2, true); // 3.5 * 2 = 7, 15% discount = 1.05
      });

      expect(result.current.subtotal).toBe(7);
      expect(result.current.discount).toBeCloseTo(1.05, 2);
      expect(result.current.total).toBeCloseTo(5.95, 2);
    });

    it('calculates total with mixed items', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2, false); // 3.5 * 2 = 7, no discount
        result.current.addToCart(mockProduct2, 2, true); // 4.0 * 2 = 8, 15% discount = 1.2
      });

      expect(result.current.subtotal).toBe(15);
      expect(result.current.discount).toBeCloseTo(1.2, 2);
      expect(result.current.total).toBeCloseTo(13.8, 2);
    });
  });

  describe('localStorage persistence', () => {
    it('saves cart to localStorage on change', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'tamarque_cart',
        expect.stringContaining('test-product-1')
      );
    });
  });
});
