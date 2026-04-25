import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../schemas/reset-password.schema';
import { resetPasswordApi } from '../api/reset-password.api';

export function useFormResetPassword(token: string) {
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPasswordApi({ token, new_password: values.new_password, confirm_password: values.confirm_password });
      router.push('/auth/login');
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Reset failed. The link may have expired.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
