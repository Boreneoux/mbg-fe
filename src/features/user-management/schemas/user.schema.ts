import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(50),
  last_name: z.string().trim().max(50).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255),
  phone: z.string().trim().max(20).optional(),
  role: z.enum(['store_admin', 'user']),
  store_id: z.number().int().positive().optional(),
}).refine((data) => {
  if (data.role === 'store_admin' && !data.store_id) return false;
  return true;
}, { message: 'Store is required for Store Admin', path: ['store_id'] });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(50),
  last_name: z.string().trim().max(50).optional(),
  phone: z.string().trim().max(20).optional(),
  is_verified: z.boolean().optional(),
  role: z.enum(['store_admin', 'user']),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const changeRoleSchema = z.object({
  role: z.enum(['store_admin', 'user']),
});

export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['store_admin', 'user']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export type UserFiltersValues = z.infer<typeof userFiltersSchema>;
