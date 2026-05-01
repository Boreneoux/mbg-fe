'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { setReferrerRewardVoucherApi } from '../api/setReferrerRewardVoucher.api';

export function useSetReferrerRewardVoucher(onSuccess?: () => void) {
  const [isSettingReferrerReward, setIsSettingReferrerReward] = useState(false);

  const setReferrerRewardVoucher = async (id: string) => {
    setIsSettingReferrerReward(true);
    try {
      await setReferrerRewardVoucherApi(id);
      toast.success('Referrer reward voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to set referrer reward voucher')
        : 'Failed to set referrer reward voucher';
      toast.error(message);
    } finally {
      setIsSettingReferrerReward(false);
    }
  };

  return { setReferrerRewardVoucher, isSettingReferrerReward };
}
