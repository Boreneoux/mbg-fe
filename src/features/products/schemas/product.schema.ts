import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const photoSchema = z.instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than 1MB (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB)`,
  })
  .refine((file) => ALLOWED_TYPES.includes(file.type), {
    message: `Allowed types: ${ALLOWED_TYPES.join(', ')}`,
  });

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, 'Max 255 characters'),
  description: z.string().trim().min(1, 'Description is required').max(1000, 'Max 1000 characters'),
  price: z
    .number({ error: 'Price is required' })
    .positive('Price must be greater than 0'),
  weight: z
    .number({ error: 'Weight is required' })
    .positive('Weight must be greater than 0'),
  category_id: z
    .number({ error: 'Category is required' })
    .int()
    .positive('Category is required'),
  photos: z
    .array(photoSchema)
    .max(5, 'Maximum 5 photos allowed')
    .optional(),
  primaryIndex: z.number().int().min(0).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  deleteImageIds: z.array(z.number().int().positive()).optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided' },
);

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
