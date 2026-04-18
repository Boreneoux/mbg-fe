'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import {
  createUserSchema,
  CreateUserFormValues,
} from '../schemas/user.schema';
import { createUserApi } from '../api/users.api';
import { UserWithStore } from '../types';

export function useCreateUser(onSuccess?: (user: UserWithStore) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await createUserApi(values);
      toast.success('User created successfully');
      form.reset();
      onSuccess?.(user);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to create user'
        : 'An unexpected error occurred';
      setError(message);
      form.setError('root', { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
  };
}
