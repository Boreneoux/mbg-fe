import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '@/stores/useAuthStore';
import { loginSchema, LoginFormValues } from '../schemas/login.schema';
import { loginApi } from '../api/login.api';

export function useFormLogin() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await loginApi(values);
      setUser(user);

      if (user.role === 'user') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Login failed. Please try again.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
