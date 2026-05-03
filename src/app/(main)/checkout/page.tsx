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
    originalSubtotal,
    productDiscount,
    subtotal,
    discount,
    deliveryFee,
    total,
    selectedAddress,
    setSelectedAddress,

    form,
    handleApplyDiscount,
    handleRemoveDiscount,
    handlePlaceOrder,
    isAuthenticated,
    addresses,
    appliedDiscount,
    appliedVoucher,
    availableVouchers,
    isApplyingVoucher,
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
                    <p className="text-sm text-muted-foreground">Alamat tidak ditemukan. Silahkan tambahkan alamat di profil.</p>
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
          <h2 className="text-xl font-bold mb-4">Diskon & Voucher</h2>
          
          {appliedVoucher ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <div>
                <p className="font-semibold text-green-800">{appliedVoucher.code}</p>
                <p className="text-sm text-green-700">
                  {appliedVoucher.discount_type === 'percentage' 
                    ? `Diskon ${appliedVoucher.discount_value}%` 
                    : `Diskon ${formatCurrencyIDR(Number(appliedVoucher.discount_value))}`}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRemoveDiscount}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Hapus
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit((data) => handleApplyDiscount(data, false))} className="flex gap-2 mb-4">
              <Input {...form.register('code')} placeholder="Masukkan kode" />
              <Button type="submit" variant="outline" disabled={isApplyingVoucher}>
                {isApplyingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Terapkan'}
              </Button>
            </form>
          )}

          {availableVouchers.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2 text-muted-foreground">Voucher Kamu:</p>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {availableVouchers.map((uv) => {
                  const isApplied = appliedVoucher?.code === uv.voucher.code;
                  const canUse = (uv as any).eligible;
                  const reason = (uv as any).reason as string | null;

                  return (
                    <div
                      key={uv.id}
                      className={`flex items-center justify-between p-3 border rounded-lg text-sm transition-colors ${
                        isApplied
                          ? 'bg-green-50 border-green-300'
                          : canUse
                          ? 'bg-background border-border hover:border-primary/50'
                          : 'bg-muted/40 border-border opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold tracking-wide ${isApplied ? 'text-green-800' : ''}`}>
                            {uv.voucher.code}
                          </p>
                          {uv.voucher.usage_type === 'shipping' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Ongkir</span>
                          )}
                          {uv.voucher.usage_type === 'product_specific' && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Produk</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {uv.voucher.discount_type === 'percentage'
                            ? `Diskon ${uv.voucher.discount_value}%`
                            : `Diskon ${formatCurrencyIDR(Number(uv.voucher.discount_value))}`}
                          {uv.voucher.min_purchase_amount
                            ? ` · Min. ${formatCurrencyIDR(Number(uv.voucher.min_purchase_amount))}`
                            : ''}
                        </p>
                        {!canUse && reason && (
                          <p className="text-xs text-red-500 mt-0.5">⚠ {reason}</p>
                        )}
                      </div>

                      {isApplied ? (
                        <span className="text-xs text-green-700 font-semibold ml-3 shrink-0">✓ Dipakai</span>
                      ) : canUse && !appliedVoucher ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-3 h-7 text-xs shrink-0"
                          onClick={() => {
                            form.setValue('code', uv.voucher.code);
                            handleApplyDiscount({ code: uv.voucher.code }, false);
                          }}
                        >
                          Pakai
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
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
                    <div className="flex flex-col text-right">
                      {item.discount_amount && item.discount_amount > 0 && (
                         <span className="text-xs text-muted-foreground line-through">
                           {formatCurrencyIDR(Number(item.original_total_price ?? (Number(item.product.price) * item.quantity)))}
                         </span>
                      )}
                      <span>
                        {formatCurrencyIDR(Number(item.total_price ?? (Number(item.product.price) * item.quantity)))}
                      </span>
                    </div>
                  </div>
                );
              })}

              <Separator />

              <SummaryRow title="Subtotal" value={formatCurrencyIDR(originalSubtotal)} />

              {productDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon Produk</span>
                  <span>-{formatCurrencyIDR(productDiscount)}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon Voucher</span>
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
                  Sedang diproses...
                </>
              ) : (
                'Buat Pesanan'
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full mt-3"
              asChild
              disabled={isPlacingOrder}
            >
              <Link href="/cart">Kembali ke Keranjang</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}