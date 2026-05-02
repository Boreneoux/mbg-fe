'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CreateDiscountFormValues, createDiscountSchema } from '../schemas/discount.schema';
import { createDiscountApi } from '../api/createDiscount.api';

export function useCreateDiscount(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDiscountFormValues>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      type: 'nominal',
      store_id: null,
      product_id: null,
      value: 0,
      min_purchase_amount: null,
      max_discount_value: null,
      started_at: null,
      expired_at: null,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = { ...values };
      if (payload.started_at) {
        payload.started_at = new Date(payload.started_at).toISOString();
      }
      if (payload.expired_at) {
        payload.expired_at = new Date(payload.expired_at).toISOString();
      }
      await createDiscountApi(payload);
      toast.success('Discount created successfully');
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create discount');
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
