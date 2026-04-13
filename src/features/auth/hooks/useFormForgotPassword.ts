import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../schemas/forgot-password.schema';
import { forgotPasswordApi } from '../api/forgot-password.api';

export function useFormForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const result = await forgotPasswordApi(values.email);
      setSuccessMessage(result.message);
    } catch (error: any) {
      form.setError('root', {
        message: error?.data?.message ?? 'Something went wrong. Please try again.',
      });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), successMessage };
}
