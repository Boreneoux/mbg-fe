"use client";

import { MapPin, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCheckout } from '@/features/checkout/useCheckout';
import { UserAddress } from '@/features/addresses/types';
import { formatCurrencyIDR } from '@/utils/currency';

function AddressOption({ address }: { address: UserAddress }) {
  return (
    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
      <RadioGroupItem value={address.id.toString()} id={`addr-${address.id}`} />
      <Label htmlFor={`addr-${address.id}`} className="flex-1 cursor-pointer">
        <div className="font-semibold mb-1">
          {address.label || 'Address'}
          {address.is_primary && <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Primary</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          {address.address}<br />
          {address.city.name}, {address.province.name} {address.postal_code}
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
    isPlacingOrder
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
              <RadioGroup 
                value={selectedAddress ? selectedAddress.toString() : ''} 
                onValueChange={(val) => setSelectedAddress(Number(val))}
              >
                {addresses.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">No addresses found. Please add one in your profile.</p>
                )}
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
              <PaymentOption value="payment_gateway" id="payment_gateway" label="Midtrans Payment Gateway (Card / Bank Transfer / E-Wallet)" />
            </RadioGroup>
            
            {paymentMethod === 'payment_gateway' && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                You will be redirected to the secure Midtrans payment gateway after placing your order.
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
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatCurrencyIDR(Number(item.product.price) * item.quantity)}</span>
                  </div>
                );
              })}

              <Separator />

              <SummaryRow title="Subtotal" value={formatCurrencyIDR(subtotal)} />

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrencyIDR(discount)}</span>
                </div>
              )}

              <SummaryRow title="Delivery Fee" value={formatCurrencyIDR(deliveryFee)} />

              <Separator />

              <SummaryRow title="Total" value={formatCurrencyIDR(total)} highlight />
            </div>

            <Button
              className="w-full relative"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || addresses.length === 0}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}