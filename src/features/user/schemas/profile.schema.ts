import { z } from 'zod';

export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'Max 50 characters'),
  last_name: z.string().max(50, 'Max 50 characters'),
  phone: z.string().refine(v => v === '' || /^\+?[0-9]{8,15}$/.test(v), {
    message: 'Phone must be 8-15 digits, optional + prefix'
  }),
  email: z.email('Invalid email address').max(255)
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirm_password: z.string().min(1, 'Please confirm your new password')
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
