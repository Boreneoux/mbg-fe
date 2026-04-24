export type VoucherType = 'product_specific' | 'total_purchase' | 'shipping';
export type DiscountType = 'percentage' | 'nominal';

export type Voucher = {
  id: number;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_discount_amount?: number | null;
  min_purchase_amount?: number | null;
  usage_type: VoucherType;
  product_id?: number | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
  } | null;
};
