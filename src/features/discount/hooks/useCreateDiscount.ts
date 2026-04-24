'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { createDiscountApi } from '../api/createDiscount.api';
import { createDiscountSchema, CreateDiscountFormValues } from '../schemas/discount.schema';
import { CreateDiscountInput } from '../types';

export function useCreateDiscount(
  onSuccess?: () => void,
  defaultValues?: Partial<CreateDiscountFormValues>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDiscountFormValues>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      store_id: 0,
      product_id: null,
      type: 'percentage',
      value: null,
      min_purchase_amount: null,
      max_discount_value: null,
      started_at: null,
      expired_at: null,
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload: CreateDiscountInput = {
        store_id: values.store_id,
        product_id: values.product_id ?? null,
        type: values.type,
        value: values.value ?? null,
        min_purchase_amount: values.min_purchase_amount ?? null,
        max_discount_value: values.max_discount_value ?? null,
        started_at: values.started_at ?? null,
        expired_at: values.expired_at ?? null,
      };

      await createDiscountApi(payload);
      toast.success('Discount created successfully.');
      form.reset();
      onSuccess?.();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message ?? 'Failed to create discount.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
