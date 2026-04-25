'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateVoucherApi } from '../api/updateVoucher.api';
import { CreateVoucherFormValues } from '../schemas/voucher.schema';

export function useUpdateVoucher(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateVoucher = async (id: number, data: Partial<CreateVoucherFormValues>) => {
    setIsUpdating(true);
    try {
      await updateVoucherApi(id, data);
      toast.success('Voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update voucher');
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateVoucher, isUpdating };
}
