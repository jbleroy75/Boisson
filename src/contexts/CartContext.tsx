'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Product, CartItem } from '@/types';

// Cart state
interface CartState {
  items: CartItem[];
  checkoutId: string | null;
}

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; isSubscription?: boolean } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CHECKOUT_ID'; payload: string }
  | { type: 'LOAD_CART'; payload: CartState };

// Cart context value
interface CartContextValue {
  items: CartItem[];
  checkoutId: string | null;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (product: Product, quantity?: number, isSubscription?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCheckoutId: (id: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, isSubscription } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.isSubscription === isSubscription
      );

      if (existingIndex > -1) {
        // Update existing item quantity
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: newItems };
      }

      // Add new item
      return {
        ...state,
        items: [...state.items, { product, quantity, isSubscription }],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
      };

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [], checkoutId: null };

    case 'SET_CHECKOUT_ID':
      return { ...state, checkoutId: action.payload };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

// Storage key
const CART_STORAGE_KEY = 'tamarque_cart';

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], checkoutId: null });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  // Calculate totals
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const discount = state.items.reduce((sum, item) => {
    if (item.isSubscription) {
      return sum + item.product.price * item.quantity * 0.15; // 15% subscription discount
    }
    return sum;
  }, 0);

  const total = subtotal - discount;

  // Actions
  const addToCart = (product: Product, quantity = 1, isSubscription = false) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, isSubscription } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCheckoutId = (id: string) => {
    dispatch({ type: 'SET_CHECKOUT_ID', payload: id });
  };

  const value: CartContextValue = {
    items: state.items,
    checkoutId: state.checkoutId,
    itemCount,
    subtotal,
    discount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCheckoutId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
