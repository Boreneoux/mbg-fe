'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import {
  updateUserSchema,
  UpdateUserFormValues,
} from '../schemas/user.schema';
import { updateUserApi } from '../api/users.api';
import { UserWithStore } from '../types';

export function useUpdateUser(
  userId: string,
  onSuccess?: (user: UserWithStore) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      is_verified: false,
      role: 'user',
    },
  });

  const onSubmit = async (values: UpdateUserFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await updateUserApi(userId, values);
      toast.success('User updated successfully');
      onSuccess?.(user);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to update user'
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
