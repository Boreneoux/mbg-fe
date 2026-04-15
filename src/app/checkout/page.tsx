"use client";

import { MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCheckout } from '@/features/checkout/useCheckout';
import type { Address } from '@/features/checkout/types';

function AddressOption({ address }: { address: Address }) {
  return (
    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
      <RadioGroupItem value={address.id} id={address.id} />
      <Label htmlFor={address.id} className="flex-1 cursor-pointer">
        <div className="font-semibold mb-1">{address.label}</div>
        <div className="text-sm text-muted-foreground">
          {address.street}<br />
          {address.city}, {address.state} {address.zipCode}
        </div>
      </Label>
    </div>
  );
}

function PaymentOption({ value, id, label }: { value: string; id: string; label: string }) {
  return (
    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

function SummaryRow({ title, value, highlight }: { title: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between ${highlight ? 'text-lg font-bold' : ''}`}>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const {
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
    isAuthenticated,
    addresses,
    appliedDiscount,
    signIn,
  } = useCheckout();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Delivery Address</h2>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Please sign in to continue</p>
                <Button onClick={signIn}>Sign In</Button>
              </div>
            ) : (
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {addresses.map((address) => (
                  <AddressOption key={address.id} address={address} />
                ))}
              </RadioGroup>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <PaymentOption value="card" id="card" label="Credit/Debit Card" />
              <PaymentOption value="cash" id="cash" label="Cash on Delivery" />
            </RadioGroup>

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Discount Code */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Discount Code</h2>
            <form onSubmit={form.handleSubmit(handleApplyDiscount)} className="flex gap-2">
              <Input {...form.register('code')} placeholder="Enter code" />
              <Button type="submit" variant="outline">Apply</Button>
            </form>
            {appliedDiscount && (
              <p className="text-sm text-green-600 mt-2">✓ Code "{appliedDiscount}" applied</p>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => {
                if (!item.product) return null;
                return (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}

              <Separator />

              <SummaryRow title="Subtotal" value={`$${subtotal.toFixed(2)}`} />

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <SummaryRow title="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />

              <Separator />

              <SummaryRow title="Total" value={`$${total.toFixed(2)}`} highlight />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}