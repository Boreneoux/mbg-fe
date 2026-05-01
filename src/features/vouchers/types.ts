export type VoucherType = 'product_specific' | 'total_purchase' | 'shipping';
export type DiscountType = 'percentage' | 'nominal';

export type Voucher = {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_discount_amount?: number | null;
  min_purchase_amount?: number | null;
  usage_type: VoucherType;
  product_id?: string | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
  is_referral: boolean;
  is_referrer_reward: boolean;
  reward_duration_days: number | null;
  product?: {
    id: string;
    name: string;
  } | null;
};

export type UserVoucher = {
  id: string;
  is_used: boolean;
  used_at: string | null;
  expired_at: string | null;
  created_at: string;
  voucher: Voucher;
};
