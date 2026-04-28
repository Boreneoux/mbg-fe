'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { setReferralVoucherApi } from '../api/setReferralVoucher.api';

export function useSetReferralVoucher(onSuccess?: () => void) {
  const [isSettingReferral, setIsSettingReferral] = useState(false);

  const setReferralVoucher = async (id: number) => {
    setIsSettingReferral(true);
    try {
      await setReferralVoucherApi(id);
      toast.success('Referral voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set referral voucher');
    } finally {
      setIsSettingReferral(false);
    }
  };

  return { setReferralVoucher, isSettingReferral };
}
