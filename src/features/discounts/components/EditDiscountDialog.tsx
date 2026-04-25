'use client';

import { useEffect, useState } from 'react';
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
        started_at: discount.started_at ? new Date(discount.started_at).toISOString().slice(0, 16) : null,
        expired_at: discount.expired_at ? new Date(discount.expired_at).toISOString().slice(0, 16) : null,
      });
    }
  }, [discount, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!discount) return;
    setIsSubmitting(true);
    try {
      await updateDiscountApi(discount.id, values);
      toast.success('Discount updated successfully');
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update discount');
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
            form={form as any}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
