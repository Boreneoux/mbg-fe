'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetOrder } from '@/features/orders/hooks/useGetOrder';
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIDR } from '@/utils/currency';
import { toast } from 'sonner';
import { getPaymentUrlApi } from '@/features/orders/api/orders.api';
import { useState } from 'react';
import { translateOrderStatus, translatePaymentMethod } from '@/features/orders/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { order, isLoading, error } = useGetOrder(id as string);
  const [isPaying, setIsPaying] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || 'Order Not Found'}</h1>
        <Button onClick={() => router.push('/account/orders')}>Kembali ke Pesanan Saya</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-600 text-white hover:bg-emerald-700';
      case 'cancelled':
        return 'bg-rose-600 text-white hover:bg-rose-700';
      case 'processing':
      case 'waiting_for_confirmation':
        return 'bg-sky-600 text-white hover:bg-sky-700';
      case 'shipped':
        return 'bg-violet-600 text-white hover:bg-violet-700';
      case 'waiting_for_payment':
        return 'bg-amber-500 text-white hover:bg-amber-600';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  const formatStatus = (status: string) => translateOrderStatus(status);
  const formatPaymentMethod = (method: string) => translatePaymentMethod(method);

  const formatCurrency = (amount: number | string) => {
    return formatCurrencyIDR(Number(amount));
  };

  const subtotal = Number(order.total_price) + Number(order.total_discount) - Number(order.shipping_cost);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Pesanan Saya
      </Button>

      <div className="mb-6 mt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <Badge className={`${getStatusColor(order.status)} font-bold`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            {formatStatus(order.status)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Dibuat pada {new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Produk</h2>
            </div>

            <div className="space-y-4">
              {order.order_items.map((item) => {
                const primaryImage = item.product?.product_images?.find((img) => img.is_primary)?.image_url 
                                  || item.product?.product_images?.[0]?.image_url;
                
                return (
                  <div key={item.id} className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryImage || '/placeholder.png'}
                      alt={item.product?.name || 'Product'}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">Jumlah: {item.quantity}</p>
                      <p className="text-sm">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right font-semibold">
                      {formatCurrency(item.total_price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Shipping Address */}
          {order.address && (
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Alamat Pengiriman</h2>
              </div>
              <div className="text-muted-foreground text-sm">
                <p className="font-semibold text-foreground mb-1">{order.address.label || 'Address'}</p>
                <p className="font-medium text-foreground">{order.address.recipient_name} ({order.address.phone})</p>
                <p className="mt-2">{order.address.address}</p>
                <p>
                  {order.address.district?.name ? `${order.address.district.name}, ` : ''}
                  {order.address.city?.name}
                </p>
                <p>
                  {order.address.province?.name} {order.address.postal_code || ''}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Rincian Pesanan</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {Number(order.total_discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon</span>
                  <span>-{formatCurrency(order.total_discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongkos Kirim</span>
                <span className="font-semibold">{formatCurrency(order.shipping_cost)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">{formatCurrency(order.total_price)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>Dibayar dengan {formatPaymentMethod(order.payment_method)}</span>
            </div>
          </Card>

          {order.status === 'waiting_for_payment' && (
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isPaying}
                onClick={async () => {
                  setIsPaying(true);
                  try {
                    const response = await getPaymentUrlApi(order.id);
                    const snapToken = response.data.snap_token;
                    
                    if (window.snap) {
                      window.snap.pay(snapToken, {
                        onSuccess: () => {
                          toast.success('Pembayaran berhasil!');
                          window.location.reload();
                        },
                        onPending: () => {
                          toast.info('Pembayaran sedang diproses.');
                          window.location.reload();
                        },
                        onError: () => {
                          toast.error('Pembayaran gagal.');
                          setIsPaying(false);
                        },
                        onClose: () => {
                          toast.warning('Popup pembayaran ditutup.');
                          setIsPaying(false);
                        }
                      });
                    } else {
                      window.location.href = response.data.payment_url;
                    }
                  } catch (error) {
                    toast.error('Gagal memulai pembayaran.');
                    setIsPaying(false);
                  }
                }}
              >
                {isPaying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Bayar Sekarang'
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Silakan selesaikan pembayaran untuk memproses pesanan Anda.
              </p>
            </div>
          )}

          {order.status === 'confirmed' && (
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Pesan Lagi
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}