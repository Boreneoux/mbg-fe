import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthStore from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAddresses } from '@/features/addresses/hooks/useAddresses';
import { createOrderApi, getPaymentUrlApi } from '@/features/orders/api/orders.api';
import { discountSchema, type DiscountFormData } from './schema';

export const useCheckout = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cart, selectedItems, appliedDiscount, setAppliedDiscount, clear } = useCartStore();
  const { addresses } = useAddresses();
  
  // Set default address to ID of primary address or first address
  const defaultAddressId = addresses.find(a => a.is_primary)?.id || addresses[0]?.id;
  const [selectedAddress, setSelectedAddress] = useState<number | ''>('');

  useEffect(() => {
    if (defaultAddressId && selectedAddress === '') {
      setSelectedAddress(defaultAddressId);
    }
  }, [defaultAddressId, selectedAddress]);

  const [paymentMethod, setPaymentMethod] = useState('payment_gateway');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: { code: '' },
  });

  const cartItems = cart?.cart_items.filter(item => selectedItems.includes(item.id)) || [];

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems.length, router]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.product?.price) || 0) * item.quantity,
    0
  );
  
  const discount = appliedDiscount === 'WELCOME10' ? subtotal * 0.1 : 0;
  const deliveryFee = 20000;
  const total = subtotal - discount + deliveryFee;

  const handleApplyDiscount = (data: DiscountFormData) => {
    const code = data.code;
    if (['WELCOME10', 'FRESH20', 'SAVE5'].includes(code)) {
      setAppliedDiscount(code);
      toast.success('Discount code applied!');
    } else {
      toast.error('Invalid discount code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // 1. Create order
      const createResponse = await createOrderApi({
        address_id: selectedAddress as number,
        payment_method: 'payment_gateway',
        shipping_method: 'Standard',
        shipping_cost: deliveryFee,
        cart_item_ids: selectedItems,
        ...(appliedDiscount ? { voucher_code: appliedDiscount } : {})
      });
      
      const orderId = createResponse.data.order.id;
      
      // 2. Get payment URL
      const paymentResponse = await getPaymentUrlApi(orderId);
      const paymentUrl = paymentResponse.data.payment_url;
      
      clear();
      toast.success('Order created, redirecting to payment gateway...');
      
      // 3. Redirect to midtrans
      window.location.href = paymentUrl;
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const signIn = () => router.push('/login');

  return {
    cartItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    form,
    handleApplyDiscount,
    handlePlaceOrder,
    isAuthenticated: !!user,
    addresses,
    appliedDiscount,
    signIn,
    isPlacingOrder
  };
};