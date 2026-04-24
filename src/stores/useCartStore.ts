import { create } from 'zustand';
import type { Cart } from '@/features/cart/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  appliedDiscount: string | null;
  selectedItems: number[]; // Array of cart item IDs
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAppliedDiscount: (code: string | null) => void;
  updateItem: (cartItemId: number, quantity: number) => void;
  removeItem: (cartItemId: number) => void;
  clear: () => void;
  
  // Selection actions
  setSelectedItems: (ids: number[]) => void;
  toggleSelectedItem: (id: number) => void;
  clearSelectedItems: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  appliedDiscount: null,
  selectedItems: [],
  setCart: (cart) => {
    set({ cart });
    // Initialize selectedItems if it's the first time cart is loaded and selectedItems is empty
    set((state) => {
      if (cart && state.selectedItems.length === 0) {
        return { selectedItems: cart.cart_items.map(item => item.id) };
      }
      return state;
    });
  },
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
      selectedItems: state.selectedItems.filter(id => id !== cartItemId),
    })),
  clear: () => set({ cart: null, appliedDiscount: null, selectedItems: [] }),

  setSelectedItems: (ids) => set({ selectedItems: ids }),
  toggleSelectedItem: (id) => set((state) => ({
    selectedItems: state.selectedItems.includes(id)
      ? state.selectedItems.filter(itemId => itemId !== id)
      : [...state.selectedItems, id]
  })),
  clearSelectedItems: () => set({ selectedItems: [] }),
}));
