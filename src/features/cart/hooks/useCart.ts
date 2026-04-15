import { useCallback } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { cartService } from '../services/cart.service';
import useCartStore from '@/stores/useCartStore';

export const useCart = () => {
  const { toast } = useToast();
  const cartStore = useCartStore();

  const fetchCart = useCallback(async () => {
    cartStore.setLoading(true);
    cartStore.setError(null);
    try {
      const cart = await cartService.getCart();
      cartStore.setCart(cart);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch cart'
        : 'Failed to fetch cart';
      cartStore.setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      cartStore.setLoading(false);
    }
  }, [cartStore, toast]);

  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      cartStore.setError(null);
      try {
        if (quantity < 1) {
          await removeFromCart(cartItemId);
          return;
        }
        await cartService.updateItem(cartItemId, quantity);
        cartStore.updateItem(cartItemId, quantity);
        toast({
          title: 'Success',
          description: 'Cart updated',
        });
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to update cart'
          : 'Failed to update cart';
        cartStore.setError(message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message,
        });
      }
    },
    [cartStore, toast]
  );

  const removeFromCart = useCallback(
    async (cartItemId: number) => {
      cartStore.setError(null);
      try {
        await cartService.deleteItem(cartItemId);
        cartStore.removeItem(cartItemId);
        toast({
          title: 'Success',
          description: 'Item removed from cart',
        });
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to remove item'
          : 'Failed to remove item';
        cartStore.setError(message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message,
        });
      }
    },
    [cartStore, toast]
  );

  const clearCart = useCallback(async () => {
    if (!cartStore.cart?.cart_items.length) return;
    cartStore.setError(null);
    try {
      await Promise.all(
        cartStore.cart.cart_items.map((item) => cartService.deleteItem(item.id))
      );
      cartStore.clear();
      toast({
        title: 'Success',
        description: 'Cart cleared',
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to clear cart'
        : 'Failed to clear cart';
      cartStore.setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    }
  }, [cartStore, toast]);

  return {
    cart: cartStore.cart,
    isLoading: cartStore.isLoading,
    error: cartStore.error,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
