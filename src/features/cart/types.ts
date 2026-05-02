import { Product } from '@/features/products/types';

export type CartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  discount_amount?: number;
  discount_id?: string;
  is_bogo_item?: boolean;
  original_total_price?: number;
  total_price?: number;
};

export type Cart = {
  id: number;
  store_id: number;
  cart_items: CartItem[];
};
