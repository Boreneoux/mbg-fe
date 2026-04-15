import { create } from 'zustand';
import type { Cart, CartItem } from '@/features/cart/types';

type UseCartStore = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (cartItemId: number, quantity: number) => void;
  removeItem: (cartItemId: number) => void;
  clear: () => void;
};

const useCartStore = create<UseCartStore>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addItem: (item) =>
    set((state) => {
      if (!state.cart) return state;
      const existingIndex = state.cart.cart_items.findIndex(
        (i) => i.product_id === item.product_id
      );

      if (existingIndex >= 0) {
        const updated = [...state.cart.cart_items];
        updated[existingIndex] = item;
        return { cart: { ...state.cart, cart_items: updated } };
      }

      return { cart: { ...state.cart, cart_items: [...state.cart.cart_items, item] } };
    }),

  updateItem: (cartItemId, quantity) =>
    set((state) => {
      if (!state.cart) return state;
      const updated = state.cart.cart_items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      return { cart: { ...state.cart, cart_items: updated } };
    }),

  removeItem: (cartItemId) =>
    set((state) => {
      if (!state.cart) return state;
      const filtered = state.cart.cart_items.filter((item) => item.id !== cartItemId);
      return filtered.length === 0 ? { cart: null } : { cart: { ...state.cart, cart_items: filtered } };
    }),

  clear: () => set({ cart: null }),
}));

export default useCartStore;
