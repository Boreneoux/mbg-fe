export type OrderStatus =
  | 'waiting_for_payment'
  | 'waiting_for_confirmation'
  | 'processing'
  | 'shipped'
  | 'confirmed'
  | 'cancelled';

export type PaymentMethod = 'payment_gateway';

export type UserAddress = {
  id: string;
  label?: string;
  recipient_name: string;
  phone: string;
  address: string;
  postal_code?: string;
  city: { name: string };
  province: { name: string };
  district?: { name: string };
};

export type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  discount_amount: number;
  total_price: number;
  product: {
    id: string;
    slug: string;
    name: string;
    product_images?: { id: string; image_url: string; is_primary: boolean }[];
  };
};

export type Order = {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_price: number;
  total_discount: number;
  shipping_cost: number;
  payment_method: PaymentMethod;
  created_at: string;
  order_items: OrderItem[];
  address: UserAddress;
  store?: {
    id: string;
    name: string;
    city: { name: string };
  };
};

export type OrderPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
