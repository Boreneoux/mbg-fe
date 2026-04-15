import axios from 'axios';
import type { CartItem, Cart } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: `${API_BASE}/cart`,
  withCredentials: true,
});

export const cartService = {
  async getCart() {
    const { data } = await api.get<{ success: boolean; data: { cart: Cart | null } }>('/');
    return data.data.cart;
  },

  async addItem(productId: number, quantity: number, storeId: number) {
    const { data } = await api.post<{ success: boolean; data: { cart_item: CartItem } }>(
      '/',
      { product_id: productId, quantity, store_id: storeId }
    );
    return data.data.cart_item;
  },

  async updateItem(cartItemId: number, quantity: number) {
    const { data } = await api.put<{ success: boolean; data: { cart_item: CartItem } }>(
      `/${cartItemId}`,
      { quantity }
    );
    return data.data.cart_item;
  },

  async deleteItem(cartItemId: number) {
    const { data } = await api.delete<{ success: boolean }>(`/${cartItemId}`);
    return data;
  },
};
