'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { 
  adminConfirmPaymentApi, 
  adminShipOrderApi, 
  adminProcessShipmentApi,
  adminCancelOrderApi,
  adminSyncPaymentStatusApi
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
    'Payment confirmed — order is now processing'
  );

  const processShipment = () => handleAction(
    () => adminProcessShipmentApi(orderNumber),
    'Shipment processed — delivery timer started'
  );

  const shipOrder = () => handleAction(
    () => adminShipOrderApi(orderNumber),
    'Order marked as shipped'
  );

  const cancelOrder = () => handleAction(
    () => adminCancelOrderApi(orderNumber),
    'Order cancelled successfully'
  );

  const syncPayment = () => handleAction(
    () => adminSyncPaymentStatusApi(orderNumber),
    'Payment status synchronized with Midtrans'
  );

  return {
    confirmPayment,
    processShipment,
    shipOrder,
    cancelOrder,
    syncPayment,
    isUpdating
  };
}
