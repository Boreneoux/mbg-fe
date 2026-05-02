import { useState, useEffect } from 'react';
import { calculateShippingCostApi, ShippingOption } from '../api/shipping.api';
import { toast } from 'sonner';

interface UseShippingFeeProps {
  storeId?: string;
  addressId?: string;
  weight: number;
  courier?: 'jne' | 'tiki' | 'pos';
  enabled?: boolean;
}

export const useShippingFee = ({
  storeId,
  addressId,
  weight,
  courier = 'jne',
  enabled = true,
}: UseShippingFeeProps) => {
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchShippingCost = async () => {
      if (!enabled || !storeId || !addressId || weight <= 0) {
        setDeliveryFee(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await calculateShippingCostApi({
          store_id: storeId,
          address_id: addressId,
          weight: Math.max(1, Math.round(weight)),
          courier,
        });

        if (isMounted) {
          setDistanceKm(result.distance_km);
          setShippingOptions(result.options);
          
          // Select the first available service cost as default delivery fee
          if (result.options.length > 0 && result.options[0].cost && Array.isArray(result.options[0].cost) && result.options[0].cost.length > 0) {
            setDeliveryFee(result.options[0].cost[0].value);
          } else if (result.options.length > 0 && typeof result.options[0].cost === 'number') {
             // In case backend flattens it directly to number
             setDeliveryFee(result.options[0].cost as number);
          } else {
             // Fallback
             setDeliveryFee(0);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          const errorMessage = err.response?.data?.message || 'Gagal menghitung ongkos kirim';
          setError(errorMessage);
          setDeliveryFee(0);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Debounce slightly to prevent rapid API calls if weight/address changes fast
    const timeoutId = setTimeout(() => {
      fetchShippingCost();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [storeId, addressId, weight, courier, enabled]);

  return {
    deliveryFee,
    setDeliveryFee,
    distanceKm,
    shippingOptions,
    isLoading,
    error,
  };
};
