'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VoucherForm } from './VoucherForm';
import { updateVoucherApi } from '../api/updateVoucher.api';
import { CreateVoucherFormValues, createVoucherSchema } from '../schemas/voucher.schema';
import { Voucher } from '../types';

interface EditVoucherDialogProps {
  voucher: Voucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditVoucherDialog({ voucher, open, onOpenChange, onSuccess }: EditVoucherDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateVoucherFormValues>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      code: '',
      usage_type: 'total_purchase',
      discount_type: 'nominal',
      discount_value: 0,
      min_purchase_amount: null,
      max_discount_amount: null,
      product_id: null,
      expired_at: '',
    },
  });

  useEffect(() => {
    if (voucher && open) {
      form.reset({
        code: voucher.code,
        usage_type: voucher.usage_type,
        discount_type: voucher.discount_type,
        discount_value: Number(voucher.discount_value),
        min_purchase_amount: voucher.min_purchase_amount ? Number(voucher.min_purchase_amount) : null,
        max_discount_amount: voucher.max_discount_amount ? Number(voucher.max_discount_amount) : null,
        product_id: voucher.product_id,
        expired_at: voucher.expired_at ? voucher.expired_at.slice(0, 10) : '',
      });
    }
  }, [voucher, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!voucher) return;
    setIsSubmitting(true);
    try {
      // Convert datetime-local value ("YYYY-MM-DDTHH:mm") to full ISO string
      const payload = {
        ...values,
        expired_at: values.expired_at 
          ? new Date(values.expired_at).toISOString() 
          : values.expired_at,
      };
      await updateVoucherApi(voucher.id, payload);
      toast.success('Voucher updated successfully');
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to update voucher')
        : 'Failed to update voucher';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Voucher</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <VoucherForm
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
