import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderApi } from '../api/get-order.api';
import { uploadPaymentProofApi } from '../api/upload-payment-proof.api';
import useAuthStore from '@/stores/useAuthStore';
import type { Order } from '../types';

export function useUploadPaymentProof(orderId: string, onSuccess: () => void, onError: (message: string) => void) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch and validate order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderApi(orderId);
        setOrder(fetchedOrder);

        // Validate order status
        if (fetchedOrder.status !== 'waiting_for_payment') {
          onError('This order is not waiting for payment.');
          router.push(`/account/orders/${orderId}`);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        onError('Unable to retrieve order details.');
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId, router, onError]);

  const handleUpload = async (file: File): Promise<void> => {
    if (!user) {
      onError('Please sign in before uploading payment proof.');
      router.push('/auth/login');
      return;
    }

    if (!file) {
      onError('Please choose an image of your payment receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadPaymentProofApi(orderId, file);
      onSuccess();
      router.push(`/account/orders/${orderId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      onError('Unable to upload payment proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    order,
    isLoadingOrder,
    isSubmitting,
    handleUpload,
  };
}
