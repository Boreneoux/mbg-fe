import { z } from 'zod';

const discountTypeEnum = z.enum(['percentage', 'nominal', 'buy_one_get_one']);
const voucherTypeEnum = z.enum(['product_specific', 'total_purchase', 'shipping']);

export const createVoucherSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  discount_type: discountTypeEnum,
  discount_value: z.number().min(0),
  max_discount_amount: z.number().min(0).optional().nullable(),
  min_purchase_amount: z.number().min(0).optional().nullable(),
  usage_type: voucherTypeEnum,
  product_id: z.string().min(1).optional().nullable(),
  reward_duration_days: z.number().int().min(1).optional().nullable(),
  expired_at: z.string()
}).refine((data) => {
  if (data.usage_type === 'product_specific') {
    return data.product_id !== null && data.product_id !== undefined;
  }
  return true;
}, {
  message: "Product is required for product_specific vouchers",
  path: ["product_id"]
});

export type CreateVoucherFormValues = z.infer<typeof createVoucherSchema>;
