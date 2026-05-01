'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CreateVoucherFormValues, createVoucherSchema } from '../schemas/voucher.schema';
import { createVoucherApi } from '../api/createVoucher.api';

export function useCreateVoucher(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateVoucherFormValues>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      code: '',
      discount_type: 'nominal',
      discount_value: 0,
      max_discount_amount: null,
      min_purchase_amount: null,
      usage_type: 'total_purchase',
      product_id: null,
      expired_at: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = { ...values };
      if (payload.expired_at) {
        payload.expired_at = new Date(payload.expired_at).toISOString();
      }
      await createVoucherApi(payload);
      toast.success('Voucher created successfully');
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create voucher');
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
