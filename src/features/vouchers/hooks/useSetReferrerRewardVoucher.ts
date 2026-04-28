'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { setReferrerRewardVoucherApi } from '../api/setReferrerRewardVoucher.api';

export function useSetReferrerRewardVoucher(onSuccess?: () => void) {
  const [isSettingReferrerReward, setIsSettingReferrerReward] = useState(false);

  const setReferrerRewardVoucher = async (id: number) => {
    setIsSettingReferrerReward(true);
    try {
      await setReferrerRewardVoucherApi(id);
      toast.success('Referrer reward voucher updated successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set referrer reward voucher');
    } finally {
      setIsSettingReferrerReward(false);
    }
  };

  return { setReferrerRewardVoucher, isSettingReferrerReward };
}
