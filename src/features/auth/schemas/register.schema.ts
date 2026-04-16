import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z.string().min(1, 'Nama depan wajib diisi'),
  last_name: z.string().min(1, 'Nama belakang wajib diisi'),
  email: z.email('Format email tidak valid'),
  phone: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^\+?[0-9]{8,15}$/, 'Nomor telepon tidak valid (8-15 digit)'),
  referral_code: z.string().max(20).optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
