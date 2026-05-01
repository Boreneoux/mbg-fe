export type DiscountType = 'percentage' | 'nominal' | 'buy_one_get_one';

export interface Discount {
  id: string;
  store_id: string;
  product_id: string | null;
  type: DiscountType;
  value: string | number | null;
  min_purchase_amount: string | number | null;
  max_discount_value: string | number | null;
  is_active: boolean;
  started_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string;

  store?: {
    id: string;
    name: string;
  };
  product?: {
    id: string;
    name: string;
  } | null;
}
