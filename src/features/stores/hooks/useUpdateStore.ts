'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createStoreSchema,
  CreateStoreFormValues
} from '@/features/stores/schemas/store.schema';
import { updateStoreApi } from '@/features/stores/api/updateStore.api';
import { Store } from '@/features/stores/types';

type ApiErr = { data?: { message?: string } };

export function useUpdateStore(store: Store | null, onSuccess?: () => void) {
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
      max_delivery_distance: 0
    }
  });

  useEffect(() => {
    if (store) {
      form.reset({
        name: store.name,
        address: store.address,
        province_id: store.province_id,
        city_id: store.city_id,
        district_id: store.district_id,
        postal_code: store.postal_code ?? '',
        latitude: Number(store.latitude),
        longitude: Number(store.longitude),
        max_delivery_distance: Number(store.max_delivery_distance)
      });
    }
  }, [store, form]);

  const onSubmit = form.handleSubmit(async values => {
    if (!store) return;
    setIsSubmitting(true);
    try {
      await updateStoreApi(store.id, values);
      toast.success('Store updated successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/stores');
      }
    } catch (err) {
      const message =
        (err as ApiErr)?.data?.message ?? 'Failed to update store';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
