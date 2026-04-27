import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { setupPasswordApi } from '../api/setup-password.api';

const adminSetupPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type AdminSetupPasswordFormValues = z.infer<typeof adminSetupPasswordSchema>;

export function useAdminSetupPassword(token: string) {
  const router = useRouter();

  const form = useForm<AdminSetupPasswordFormValues>({
    resolver: zodResolver(adminSetupPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: AdminSetupPasswordFormValues) => {
    try {
      await setupPasswordApi({ token, ...values });
      router.push('/admin/login');
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Setup failed. The link may have expired.')
        : 'Setup failed. The link may have expired.';
      form.setError('root', { message });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
