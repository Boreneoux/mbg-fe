import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthStore from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { discountSchema, type DiscountFormData } from './schema';
import { mockProducts, mockAddresses } from '@/data/mockData';

export const useCheckout = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cart, clearCart, appliedDiscount, setAppliedDiscount } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, router]);

  const cartItems = cart.map((item) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = appliedDiscount === 'WELCOME10' ? subtotal * 0.1 : 0;
  const deliveryFee = 4.99;
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

  const handlePlaceOrder = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    // Simulate order placement
    toast.success('Order placed successfully!');
    clearCart();
    router.push('/orders');
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
    addresses: mockAddresses,
    appliedDiscount,
    signIn,
  };
};