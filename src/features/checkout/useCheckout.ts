import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthStore from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAddresses } from '@/features/addresses/hooks/useAddresses';
import { createOrderApi, getPaymentUrlApi } from '@/features/orders/api/orders.api';
import { useShippingFee } from '@/features/shipping/hooks/useShippingFee';
import { applyVoucherApi } from '@/features/vouchers/api/applyVoucher.api';
import { getUserVouchersApi } from '@/features/vouchers/api/getUserVouchers.api';
import { getPromotionVouchersApi } from '@/features/vouchers/api/getPromotionVouchers.api';
import type { Voucher, UserVoucher } from '@/features/vouchers/types';
import { discountSchema, type DiscountFormData } from './schema';
import { formatCurrencyIDR } from '@/utils/currency';

export const useCheckout = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cart, selectedItems, appliedDiscount, setAppliedDiscount, clear } = useCartStore();
  const { addresses } = useAddresses();
  
  // Set default address to ID of primary address or first address
  const defaultAddressId = addresses.find(a => a.is_primary)?.id || addresses[0]?.id;
  const [selectedAddress, setSelectedAddress] = useState<string | ''>('');

  useEffect(() => {
    if (defaultAddressId && selectedAddress === '') {
      setSelectedAddress(defaultAddressId);
    }
  }, [defaultAddressId, selectedAddress]);

  const [paymentMethod, setPaymentMethod] = useState('payment_gateway');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<UserVoucher[]>([]);
  const [promotionVouchers, setPromotionVouchers] = useState<Voucher[]>([]);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // Compute eligibility reason for each user voucher (client-side, for display only)
  const getVoucherEligibility = (uv: UserVoucher, cartSubtotal: number, cartProductIds: string[]) => {
    const { voucher, is_used, expired_at } = uv;
    const effectiveExpiry = expired_at ?? voucher.expired_at;
    if (is_used) return { eligible: false, reason: 'Sudah digunakan' };
    if (new Date(effectiveExpiry) < new Date()) return { eligible: false, reason: 'Sudah kadaluarsa' };
    if (voucher.min_purchase_amount && cartSubtotal < Number(voucher.min_purchase_amount)) {
      return { eligible: false, reason: `Min. belanja ${formatCurrencyIDR(Number(voucher.min_purchase_amount))}` };
    }
    if (voucher.usage_type === 'product_specific' && voucher.product_id) {
      if (!cartProductIds.includes(voucher.product_id)) {
        return { eligible: false, reason: `Khusus produk: ${voucher.product?.name ?? voucher.product_id}` };
      }
    }
    return { eligible: true, reason: null };
  };

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

  // Fetch user-assigned + general promotion vouchers in parallel
  useEffect(() => {
    if (user) {
      Promise.all([
        getUserVouchersApi().catch(() => [] as UserVoucher[]),
        getPromotionVouchersApi().catch(() => [] as Voucher[])
      ]).then(([userVouchers, promos]) => {
        setAvailableVouchers(userVouchers);
        setPromotionVouchers(promos);
      });
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price ?? ((Number(item.product?.price) || 0) * item.quantity)),
    0
  );

  // Calculate total weight (product weight is in kg, API needs grams)
  const totalWeight = cartItems.reduce(
    (sum, item) => sum + (Number(item.product?.weight) || 0) * item.quantity,
    0
  ) * 1000;

  const { deliveryFee, isLoading: isCalculatingShipping } = useShippingFee({
    storeId: cart?.store_id?.toString(),
    addressId: selectedAddress,
    weight: totalWeight > 0 ? totalWeight : 1000, // Default to 1kg if 0
    enabled: !!selectedAddress && cartItems.length > 0,
  });

  // Calculate discount dynamically based on the applied voucher
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.usage_type === 'shipping') {
      if (appliedVoucher.discount_type === 'percentage') {
        discount = deliveryFee * (Number(appliedVoucher.discount_value) / 100);
        if (appliedVoucher.max_discount_amount) {
           discount = Math.min(discount, Number(appliedVoucher.max_discount_amount));
        }
      } else {
        discount = Math.min(deliveryFee, Number(appliedVoucher.discount_value));
      }
    } else {
      if (appliedVoucher.discount_type === 'percentage') {
        discount = subtotal * (Number(appliedVoucher.discount_value) / 100);
        if (appliedVoucher.max_discount_amount) {
           discount = Math.min(discount, Number(appliedVoucher.max_discount_amount));
        }
      } else {
        discount = Math.min(subtotal, Number(appliedVoucher.discount_value));
      }
    }
  }

  // Restore voucher from store if it exists
  useEffect(() => {
    if (appliedDiscount && !appliedVoucher && cart?.store_id) {
      handleApplyDiscount({ code: appliedDiscount }, true);
    }
  }, [appliedDiscount, cart?.store_id]);

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyDiscount = async (data: DiscountFormData, isRestoring = false) => {
    const code = data.code;
    if (!cart?.store_id) return;

    setIsApplyingVoucher(true);
    try {
      const response = await applyVoucherApi({
        code,
        cart_total: subtotal,
        store_id: cart.store_id.toString(),
        product_ids: cartItems.map(item => String(item.product_id))
      });
      
      setAppliedVoucher(response.voucher);
      setAppliedDiscount(response.voucher.code);
      if (!isRestoring) toast.success(`Voucher "${response.voucher.code}" applied successfully!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid discount code';
      if (!isRestoring) toast.error(message);
      if (isRestoring) setAppliedDiscount(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedVoucher(null);
    setAppliedDiscount(null);
    form.setValue('code', '');
    toast.info('Voucher removed');
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
        address_id: selectedAddress as string,
        payment_method: 'payment_gateway',
        shipping_method: 'Standard',
        shipping_cost: deliveryFee,
        cart_item_ids: selectedItems,
        ...(appliedVoucher ? { voucher_code: appliedVoucher.code } : {})
      });
      
      const orderNumber = createResponse.data.order.order_number;

      // 2. Get payment URL and Snap Token
      const paymentResponse = await getPaymentUrlApi(orderNumber);
      const snapToken = paymentResponse.data.snap_token;

      clear();

      // 3. Trigger Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            toast.success('Payment successful!');
            router.push(`/account/orders/${orderNumber}`);
          },
          onPending: () => {
            toast.info('Payment is pending. Please complete it soon.');
            router.push(`/account/orders/${orderNumber}`);
          },
          onError: () => {
            toast.error('Payment failed. Please try again from the order details.');
            router.push(`/account/orders/${orderNumber}`);
          },
          onClose: () => {
            toast.warning('You closed the payment popup without finishing.');
            router.push(`/account/orders/${orderNumber}`);
          }
        });
      } else {
        // Fallback to redirect if snap is not loaded
        window.location.href = paymentResponse.data.payment_url;
      }
      
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
    handleRemoveDiscount,
    handlePlaceOrder,
    isAuthenticated: !!user,
    addresses,
    appliedDiscount,
    appliedVoucher,
    availableVouchers: (() => {
      const cartProductIds = cartItems.map(i => String(i.product_id));
      const userCodes = new Set(availableVouchers.map(uv => uv.voucher.code));

      // Shape general promotion vouchers to match UserVoucher so the UI is uniform
      const promoEntries = promotionVouchers
        .filter(v => !userCodes.has(v.code))
        .map(v => ({
          id: `promo-${v.id}`,
          is_used: false,
          used_at: null,
          expired_at: null,
          created_at: v.created_at,
          voucher: v,
        } as UserVoucher));

      return [...availableVouchers, ...promoEntries].map(uv => ({
        ...uv,
        ...getVoucherEligibility(uv, subtotal, cartProductIds)
      }));
    })(),
    isApplyingVoucher,
    signIn,
    isPlacingOrder,
    isCalculatingShipping
  };
};