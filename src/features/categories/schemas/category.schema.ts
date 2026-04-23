import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const photoSchema = z.instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than 1MB`,
  })
  .refine((file) => ALLOWED_TYPES.includes(file.type), {
    message: `Allowed types: JPG, PNG, GIF`,
  })
  .optional();

export const createCategorySchema = z.object({
  name: z.string().trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  photo: photoSchema,
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined && v !== ''),
  { message: 'At least one field must be provided' },
);

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
