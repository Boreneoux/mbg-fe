import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setupPasswordApi } from '../api/setup-password.api';

const setupPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Password tidak cocok',
    path: ['confirm_password'],
  });

type SetupPasswordFormValues = z.infer<typeof setupPasswordSchema>;

export function useSetupPassword(token: string) {
  const router = useRouter();

  const form = useForm<SetupPasswordFormValues>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: SetupPasswordFormValues) => {
    try {
      await setupPasswordApi({ token, ...values });
      router.push('/auth/login');
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Verifikasi gagal. Link mungkin sudah kedaluwarsa.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
