'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DiscountForm } from './DiscountForm';
import { updateDiscountApi } from '../api/updateDiscount.api';
import { CreateDiscountFormValues, createDiscountSchema } from '../schemas/discount.schema';
import { Discount } from '../types';

interface EditDiscountDialogProps {
  discount: Discount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDiscountDialog({ discount, open, onOpenChange, onSuccess }: EditDiscountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toPickerDate(value: string | null) {
    return value ? value.slice(0, 10) : null;
  }

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

  useEffect(() => {
    if (discount && open) {
      form.reset({
        type: discount.type,
        store_id: discount.store_id || 'all',
        product_id: discount.product_id,
        value: discount.value ? Number(discount.value) : null,
        min_purchase_amount: discount.min_purchase_amount ? Number(discount.min_purchase_amount) : null,
        max_discount_value: discount.max_discount_value ? Number(discount.max_discount_value) : null,
        started_at: toPickerDate(discount.started_at),
        expired_at: toPickerDate(discount.expired_at),
      });
    }
  }, [discount, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!discount) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        started_at: values.started_at ? new Date(values.started_at).toISOString() : values.started_at,
        expired_at: values.expired_at ? new Date(values.expired_at).toISOString() : values.expired_at,
      };

      await updateDiscountApi(discount.id, payload);
      toast.success('Discount updated successfully');
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to update discount')
        : 'Failed to update discount';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Discount</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <DiscountForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
