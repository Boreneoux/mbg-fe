import { create } from 'zustand';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  appliedDiscount: string | null;
  setAppliedDiscount: (code: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  appliedDiscount: null,
  setAppliedDiscount: (code) => set({ appliedDiscount: code }),
  clearCart: () => set({ cart: [], appliedDiscount: null }),
}));
