'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { setReferralVoucherApi } from '../api/setReferralVoucher.api';

export function useSetReferralVoucher(onSuccess?: () => void) {
  const [isSettingReferral, setIsSettingReferral] = useState(false);

  const setReferralVoucher = async (id: string) => {
    setIsSettingReferral(true);
    try {
      await setReferralVoucherApi(id);
      toast.success('Referral voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to set referral voucher')
        : 'Failed to set referral voucher';
      toast.error(message);
    } finally {
      setIsSettingReferral(false);
    }
  };

  return { setReferralVoucher, isSettingReferral };
}
