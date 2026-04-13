import { Product } from '@/features/products/types';

export type CartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: number;
  store_id: number;
  cart_items: CartItem[];
};
