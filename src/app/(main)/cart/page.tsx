'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItemCard } from '@/features/cart/components/CartItemCard';
import { CartItemSkeleton } from '@/features/cart/components/CartItemSkeleton';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { OrderSummary } from '@/features/cart/components/OrderSummary';

export default function ShoppingCartPage() {
  const router = useRouter();
  const { cart, isLoading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart?.cart_items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;

  const deliveryFee = subtotal > 0 ? 4.99 : 0;

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
          {cart.cart_items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              isLoading={isLoading}
            />
          ))}

          <Button
            variant="outline"
            onClick={clearCart}
            disabled={isLoading}
          >
            Clear Cart
          </Button>
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
