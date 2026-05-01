'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { updateVoucherApi } from '../api/updateVoucher.api';
import { CreateVoucherFormValues } from '../schemas/voucher.schema';

export function useUpdateVoucher(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateVoucher = async (id: string, data: Partial<CreateVoucherFormValues>) => {
    setIsUpdating(true);
    try {
      await updateVoucherApi(id, data);
      toast.success('Voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to update voucher')
        : 'Failed to update voucher';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateVoucher, isUpdating };
}
