import { z } from 'zod';

export const createDiscountSchema = z
  .object({
    store_id: z.number().int().positive({ message: 'Store is required' }),
    product_id: z.number().int().positive().optional().nullable(),
    type: z.enum(['percentage', 'nominal', 'buy_one_get_one']),
    value: z.number().min(0, { message: 'Value cannot be negative' }).optional().nullable(),
    min_purchase_amount: z.number().min(0, { message: 'Minimum purchase amount cannot be negative' }).optional().nullable(),
    max_discount_value: z.number().min(0, { message: 'Maximum discount value cannot be negative' }).optional().nullable(),
    started_at: z.string().datetime().optional().nullable(),
    expired_at: z.string().datetime().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage' || data.type === 'nominal') {
        return data.value !== null && data.value !== undefined;
      }
      return true;
    },
    {
      message: 'Value is required for percentage and nominal discount types',
      path: ['value'],
    }
  );

export type CreateDiscountFormValues = z.infer<typeof createDiscountSchema>;
