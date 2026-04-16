'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import useAuthStore from '@/stores/useAuthStore';
import { loginSchema, LoginFormValues } from '../schemas/login.schema';
import { loginApi } from '../api/login.api';

export function useFormAdminLogin() {
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
    const user = await loginApi(values).catch((error: unknown) => {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? 'Login failed. Please try again.')
        : 'An unexpected error occurred.';
      form.setError('root', { message });
      return null;
    });

    if (!user) return;

    if (user.role === 'user') {
      form.setError('root', { message: 'Access denied. Admin credentials required.' });
      return;
    }

    setUser(user);
    toast.success(`Welcome back, ${user.first_name ?? user.email}.`);
    router.push('/dashboard');
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
