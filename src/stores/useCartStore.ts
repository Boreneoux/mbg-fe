import { create } from 'zustand';
import type { Cart } from '@/features/cart/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  appliedDiscount: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAppliedDiscount: (code: string | null) => void;
  updateItem: (cartItemId: number, quantity: number) => void;
  removeItem: (cartItemId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  appliedDiscount: null,
  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setAppliedDiscount: (code) => set({ appliedDiscount: code }),
  updateItem: (cartItemId, quantity) =>
    set((state) => ({
      cart: state.cart
        ? {
            ...state.cart,
            cart_items: state.cart.cart_items.map((item) =>
              item.id === cartItemId ? { ...item, quantity } : item
            ),
          }
        : null,
    })),
  removeItem: (cartItemId) =>
    set((state) => ({
      cart: state.cart
        ? {
            ...state.cart,
            cart_items: state.cart.cart_items.filter((item) => item.id !== cartItemId),
          }
        : null,
    })),
  clear: () => set({ cart: null, appliedDiscount: null }),
}));
