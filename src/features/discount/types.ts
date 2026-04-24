export type DiscountType = 'percentage' | 'nominal' | 'buy_one_get_one';

export type Discount = {
  id: number;
  store_id: number;
  product_id?: number | null;
  type: DiscountType;
  value?: number | null;
  min_purchase_amount?: number | null;
  max_discount_value?: number | null;
  is_active: boolean;
  started_at?: string | null;
  expired_at?: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
  } | null;
};

export type CreateDiscountInput = {
  store_id: number;
  product_id?: number | null;
  type: DiscountType;
  value?: number | null;
  min_purchase_amount?: number | null;
  max_discount_value?: number | null;
  started_at?: string | null;
  expired_at?: string | null;
};
