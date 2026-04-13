import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../schemas/register.schema';
import { registerApi } from '../api/register.api';

export function useFormRegister() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerApi(values);
      router.push('/auth/verify-email');
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Registration failed. Please try again.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
