'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItemCard } from '@/features/cart/components/CartItemCard';
import { CartItemSkeleton } from '@/features/cart/components/CartItemSkeleton';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { OrderSummary } from '@/features/cart/components/OrderSummary';
import { useCartStore } from '@/stores/useCartStore';

export default function ShoppingCartPage() {
  const router = useRouter();
  const { cart, isLoading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const selectedItems = useCartStore((state) => state.selectedItems);
  const toggleSelectedItem = useCartStore((state) => state.toggleSelectedItem);
  const setSelectedItems = useCartStore((state) => state.setSelectedItems);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const selectedCartItems = cart?.cart_items.filter(item => 
    selectedItems.includes(item.id)
  ) ?? [];

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 20000 : 0; // Fixed delivery fee in IDR

  const isAllSelected = cart?.cart_items.length === selectedItems.length && cart?.cart_items.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart?.cart_items.map(item => item.id) ?? []);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return <EmptyCart onShopClick={() => router.push('/products')} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
            <Checkbox 
              id="select-all" 
              checked={isAllSelected} 
              onCheckedChange={handleToggleAll} 
            />
            <label 
              htmlFor="select-all" 
              className="text-sm font-medium cursor-pointer"
            >
              Select All ({cart.cart_items.length} items)
            </label>
          </div>

          {cart.cart_items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onToggle={() => toggleSelectedItem(item.id)}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              isLoading={isLoading}
            />
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              disabled={isLoading}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          onCheckout={() => router.push('/checkout')}
          onContinueShopping={() => router.push('/products')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
