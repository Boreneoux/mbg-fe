import { z } from 'zod';

export const discountSchema = z.object({
  code: z.string().min(1, 'Discount code is required'),
});

export type DiscountFormData = z.infer<typeof discountSchema>;