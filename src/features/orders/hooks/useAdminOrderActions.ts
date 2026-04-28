'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { 
  adminConfirmPaymentApi, 
  adminRejectPaymentApi, 
  adminShipOrderApi, 
  adminCancelOrderApi 
} from '../api/orders.api';

export function useAdminOrderActions(orderNumber: string, onUpdate?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAction = async (action: () => Promise<any>, successMessage: string) => {
    setIsUpdating(true);
    try {
      await action();
      toast.success(successMessage);
      if (onUpdate) onUpdate();
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Action failed')
        : 'Action failed';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmPayment = () => handleAction(
    () => adminConfirmPaymentApi(orderNumber),
    'Payment confirmed successfully'
  );

  const rejectPayment = () => handleAction(
    () => adminRejectPaymentApi(orderNumber),
    'Payment proof rejected'
  );

  const shipOrder = () => handleAction(
    () => adminShipOrderApi(orderNumber),
    'Order marked as shipped'
  );

  const cancelOrder = () => handleAction(
    () => adminCancelOrderApi(orderNumber),
    'Order cancelled successfully'
  );

  return {
    confirmPayment,
    rejectPayment,
    shipOrder,
    cancelOrder,
    isUpdating
  };
}
