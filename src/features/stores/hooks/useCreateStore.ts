'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createStoreSchema, CreateStoreFormValues } from '@/features/stores/schemas/store.schema';
import { createStoreApi } from '@/features/stores/api/createStore.api';

type ApiErr = { data?: { message?: string } };

export function useCreateStore(onSuccess?: () => void) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      address: '',
      province_id: 0,
      city_id: 0,
      district_id: 0,
      postal_code: '',
      latitude: 0,
      longitude: 0,
      max_delivery_distance: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await createStoreApi(values);
      toast.success('Store created successfully');
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/stores');
      }
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to create store';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
