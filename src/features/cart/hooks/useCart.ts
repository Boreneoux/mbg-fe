import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { cartService } from '../services/cart.service';
import { useCartStore } from '@/stores/useCartStore';

export const useCart = () => {
  // 1. Destructure state and actions separately using selectors
  // This is the "Zustand way" to ensure stable references
  const cart = useCartStore((state) => state.cart);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  
  const setCart = useCartStore((state) => state.setCart);
  const setLoading = useCartStore((state) => state.setLoading);
  const setError = useCartStore((state) => state.setError);
  const updateStoreItem = useCartStore((state) => state.updateItem);
  const removeStoreItem = useCartStore((state) => state.removeItem);
  const clearStore = useCartStore((state) => state.clear);

  // 2. Fetch Cart - Stable because setters don't change
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to fetch cart'
        : 'Failed to fetch cart';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  // 3. Remove Item - Stable dependency on removeStoreItem
  const removeFromCart = useCallback(
    async (cartItemId: number) => {
      setError(null);
      try {
        await cartService.deleteItem(cartItemId);
        removeStoreItem(cartItemId);
        toast.success('Item removed from cart');
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to remove item'
          : 'Failed to remove item';
        setError(message);
        toast.error(message);
      }
    },
    [removeStoreItem, setError]
  );

  // 4. Update Quantity - Depends on removeFromCart (which is now stable)
  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      setError(null);
      try {
        if (quantity < 1) {
          await removeFromCart(cartItemId);
          return;
        }
        await cartService.updateItem(cartItemId, quantity);
        updateStoreItem(cartItemId, quantity);
        toast.success('Cart updated');
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to update cart'
          : 'Failed to update cart';
        setError(message);
        toast.error(message);
      }
    },
    [updateStoreItem, setError, removeFromCart]
  );

  // 5. Clear Cart
  const clearCart = useCallback(async () => {
    if (!cart?.cart_items.length) return;
    setError(null);
    try {
      await Promise.all(
        cart.cart_items.map((item) => cartService.deleteItem(item.id))
      );
      clearStore();
      toast.success('Cart cleared');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to clear cart'
        : 'Failed to clear cart';
      setError(message);
      toast.error(message);
    }
  }, [cart, setError, clearStore]);

  // 6. Add to Cart
  const addToCart = useCallback(
    async (productId: string, quantity: number, storeId: string = '') => {
      setError(null);
      setLoading(true);
      try {
        await cartService.addItem(productId, quantity, storeId);
        await fetchCart(); // Re-fetch to get complete cart state with the new item
        toast.success('Added to cart');
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to add to cart'
          : 'Failed to add to cart';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [fetchCart, setError, setLoading]
  );

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
  };
};
