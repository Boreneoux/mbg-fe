import { z } from 'zod';

const discountTypeEnum = z.enum(['percentage', 'nominal', 'buy_one_get_one']);

export const createDiscountSchema = z.object({
  store_id: z.union([z.string().min(1), z.literal('all')]).optional().nullable(),
  product_id: z.string().min(1).optional().nullable(),
  type: discountTypeEnum,
  value: z.number().min(0).optional().nullable(),
  min_purchase_amount: z.number().min(0).optional().nullable(),
  max_discount_value: z.number().min(0).optional().nullable(),
  started_at: z.string().optional().nullable(),
  expired_at: z.string().optional().nullable()
}).refine((data) => {
  if (data.type === 'percentage' || data.type === 'nominal') {
    return data.value !== null && data.value !== undefined;
  }
  return true;
}, {
  message: "Value is required for percentage and nominal discount types",
  path: ["value"]
});

export type CreateDiscountFormValues = z.infer<typeof createDiscountSchema>;
