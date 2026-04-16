import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { completeProfileApi } from '../api/complete-profile.api';

const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^\+?[0-9]{8,15}$/, 'Nomor telepon tidak valid (8-15 digit)'),
  referral_code: z.string().max(20).optional(),
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export function useCompleteProfile() {
  const router = useRouter();

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: '',
      referral_code: '',
    },
  });

  const onSubmit = async (values: CompleteProfileFormValues) => {
    try {
      await completeProfileApi(values);
      router.push('/');
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Gagal menyimpan profil. Silakan coba lagi.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
