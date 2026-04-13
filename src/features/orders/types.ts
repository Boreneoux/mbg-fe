import { Product } from '@/features/products/types';

export type OrderStatus =
  | 'waiting_for_payment'
  | 'waiting_for_confirmation'
  | 'processing'
  | 'shipped'
  | 'confirmed'
  | 'cancelled';

export type PaymentMethod = 'manual_transfer' | 'payment_gateway';

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount_amount: number;
  total_price: number;
  product: Product;
};

export type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_price: number;
  total_discount: number;
  shipping_cost: number;
  payment_method: PaymentMethod;
  created_at: string;
  order_items: OrderItem[];
};
