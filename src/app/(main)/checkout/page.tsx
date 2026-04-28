"use client";

import Link from 'next/link';
import { MapPin, ShoppingBag, Loader2 } from 'lucide-react';
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
    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
      <RadioGroupItem value={address.id.toString()} id={`addr-${address.id}`} />
      <Label htmlFor={`addr-${address.id}`} className="flex-1 cursor-pointer">
        <div className="font-semibold mb-1">
          {address.label || 'Address'}
          {address.is_primary && <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Utama</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          {address.address}<br />
          {address.city.name}, {address.province.name} {address.postal_code}
        </div>
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
              <h2 className="text-xl font-bold">Alamat Pengiriman</h2>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Silahkan masuk untuk belanja</p>
                <Button onClick={signIn}>Masuk</Button>
              </div>
            ) : (
              <RadioGroup 
                value={selectedAddress || ''}
                onValueChange={(val) => setSelectedAddress(val)}
              >
                {addresses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">Tidak ada alamat ditemukan. Silahkan tambahkan alamat di profile.</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/account/addresses">Tambah Alamat</Link>
                    </Button>
                  </div>
                )}
                {addresses.map((address) => (
                  <AddressOption key={address.id} address={address} />
                ))}
              </RadioGroup>
            )}
          </Card>



          {/* Discount Code */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Diskon</h2>
            <form onSubmit={form.handleSubmit(handleApplyDiscount)} className="flex gap-2">
              <Input {...form.register('code')} placeholder="Masukkan kode" />
              <Button type="submit" variant="outline">Terapkan</Button>
            </form>
            {appliedDiscount && (
              <p className="text-sm text-green-600 mt-2">✓ Code "{appliedDiscount}" diterapkan</p>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Rincian Pesanan</h2>
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
                  <span>Diskon</span>
                  <span>-{formatCurrencyIDR(discount)}</span>
                </div>
              )}

              <SummaryRow title="Ongkos Kirim" value={formatCurrencyIDR(deliveryFee)} />

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
                'Buat Pesanan'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}