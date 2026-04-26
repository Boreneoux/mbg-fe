import { OrderStatus, PaymentMethod } from './types';

export const translateOrderStatus = (status: OrderStatus | string): string => {
  const statusMap: Record<string, string> = {
    waiting_for_payment: 'Menunggu Pembayaran',
    waiting_for_confirmation: 'Menunggu Konfirmasi',
    processing: 'Sedang Diproses',
    shipped: 'Sedang Dikirim',
    confirmed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  return statusMap[status] || status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const translatePaymentMethod = (method: PaymentMethod | string): string => {
  const methodMap: Record<string, string> = {
    payment_gateway: 'Midtrans',
  };

  return methodMap[method] || method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
