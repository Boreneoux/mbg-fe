'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetOrder } from '@/features/orders/hooks/useGetOrder';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIDR } from '@/utils/currency';
import { toast } from 'sonner';
import { getPaymentUrlApi, cancelOrderApi, confirmReceiptApi, syncPaymentStatusApi } from '@/features/orders/api/orders.api';
import { useState, useEffect, useCallback } from 'react';
import { translateOrderStatus, translatePaymentMethod } from '@/features/orders/utils';

// ─── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(deadlineISO?: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!deadlineISO) {
      setRemaining(null);
      return;
    }

    const deadline = new Date(deadlineISO).getTime();

    const tick = () => {
      const diff = deadline - Date.now();
      setRemaining(Math.max(0, diff));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineISO]);

  return remaining;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Waktu habis';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}j ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}d`;
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}d`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = Array.isArray(params.orderNumber) ? params.orderNumber[0] : params.orderNumber;
  const router = useRouter();

  const { order, isLoading, error, refetch } = useGetOrder(orderNumber as string);
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const paymentDeadlineMs = useCountdown(
    order?.status === 'waiting_for_payment' ? order.payment_deadline : null
  );

  // Auto-refresh while waiting for payment (catches Midtrans webhook)
  useEffect(() => {
    if (order?.status !== 'waiting_for_payment') return;
    const id = setInterval(() => refetch(), 15_000);
    return () => clearInterval(id);
  }, [order?.status, refetch]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const response = await getPaymentUrlApi(order!.order_number);
      const snapToken = response.data.snap_token;

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async () => {
            await syncPaymentStatusApi(order!.order_number);
            toast.success('Pembayaran berhasil!');
            refetch();
          },
          onPending: async () => {
            await syncPaymentStatusApi(order!.order_number);
            toast.info('Pembayaran sedang diproses.');
            refetch();
          },
          onError: async () => {
            await syncPaymentStatusApi(order!.order_number);
            toast.error('Pembayaran gagal.');
            setIsPaying(false);
            refetch();
          },
          onClose: async () => {
            await syncPaymentStatusApi(order!.order_number);
            toast.warning('Popup pembayaran ditutup.');
            setIsPaying(false);
            refetch();
          }
        });
      } else {
        window.location.href = response.data.payment_url;
      }
    } catch {
      toast.error('Gagal memulai pembayaran.');
      setIsPaying(false);
    }
  };

  const executeCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelOrderApi(order!.order_number);
      toast.success('Pesanan berhasil dibatalkan.');
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Gagal membatalkan pesanan.';
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancel = () => {
    toast.custom((t) => (
      <Card className="p-4 flex flex-col gap-3 w-[356px] border shadow-lg bg-background">
        <div>
          <h3 className="font-semibold text-foreground">Batalkan Pesanan</h3>
          <p className="text-sm text-muted-foreground mt-1">Apakah Anda yakin ingin membatalkan pesanan ini?</p>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
            Tidak
          </Button>
          <Button variant="destructive" size="sm" onClick={() => { toast.dismiss(t); executeCancel(); }}>
            Ya, Batalkan
          </Button>
        </div>
      </Card>
    ));
  };

  const executeConfirmReceipt = async () => {
    setIsConfirming(true);
    try {
      await confirmReceiptApi(order!.order_number);
      toast.success('Pesanan telah diselesaikan. Terima kasih!');
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Gagal menyelesaikan pesanan.';
      toast.error(msg);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirmReceipt = () => {
    toast.custom((t) => (
      <Card className="p-4 flex flex-col gap-3 w-[356px] border shadow-lg bg-background">
        <div>
          <h3 className="font-semibold text-foreground">Konfirmasi Penerimaan</h3>
          <p className="text-sm text-muted-foreground mt-1">Konfirmasi bahwa Anda telah menerima pesanan ini?</p>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
            Tidak
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => { toast.dismiss(t); executeConfirmReceipt(); }}>
            Ya, Diterima
          </Button>
        </div>
      </Card>
    ));
  };

  // ─── Derived state ───────────────────────────────────────────────────────────

  const successfulPaymentStatuses = ['capture', 'settlement'];
  const hasPaid = order?.midtrans_status
    ? successfulPaymentStatuses.includes(order.midtrans_status)
    : false;

  const canCancel =
    order?.status === 'waiting_for_payment' && !hasPaid;

  const canPay =
    order?.status === 'waiting_for_payment' &&
    paymentDeadlineMs !== null &&
    paymentDeadlineMs > 0;

  // ─── Loading / error ────────────────────────────────────────────────────────

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
        return 'bg-sky-600 text-white hover:bg-sky-700';
      case 'waiting_for_confirmation':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'shipped':
        return 'bg-violet-600 text-white hover:bg-violet-700';
      case 'waiting_for_payment':
        return 'bg-amber-500 text-white hover:bg-amber-600';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  const formatCurrency = (amount: number | string) => formatCurrencyIDR(Number(amount));
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
            {translateOrderStatus(order.status)}
          </Badge>
        </div>
        <p className="text-slate-700 font-medium">
          Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}{' '}
          {new Date(order.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
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
              {order.order_items?.map((item) => {
                const primaryImage =
                  item.product?.product_images?.find((img) => img.is_primary)?.image_url ||
                  item.product?.product_images?.[0]?.image_url;

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

        {/* Order Summary & Actions */}
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

            {hasPaid && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Dibayar dengan {translatePaymentMethod(order.payment_method)}</span>
                </div>
              </>
            )}
          </Card>

          {/* ── Waiting for payment actions ── */}
          {order.status === 'waiting_for_payment' && (
            <Card className="p-6 shadow-sm space-y-4">
              {/* Countdown timer */}
              {order.payment_deadline && paymentDeadlineMs !== null && (
                <div className={`rounded-lg p-4 text-center ${paymentDeadlineMs > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-rose-50 border border-rose-200'}`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className={`w-5 h-5 ${paymentDeadlineMs > 0 ? 'text-amber-600' : 'text-rose-600'}`} />
                    <span className={`text-sm font-medium ${paymentDeadlineMs > 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {paymentDeadlineMs > 0 ? 'Batas waktu pembayaran' : 'Batas waktu telah berakhir'}
                    </span>
                  </div>
                  {paymentDeadlineMs > 0 && (
                    <p className="text-2xl font-bold tabular-nums text-amber-800">
                      {formatCountdown(paymentDeadlineMs)}
                    </p>
                  )}
                </div>
              )}

              {/* Pay button */}
              {canPay && (
                <Button
                  id="btn-pay-now"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isPaying}
                  onClick={handlePay}
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
              )}

              {paymentDeadlineMs !== null && paymentDeadlineMs <= 0 && (
                <p className="text-sm text-rose-600 text-center font-medium">
                  Pesanan ini telah kadaluarsa dan akan segera dibatalkan.
                </p>
              )}

              {/* Cancel button */}
              {canCancel && (
                <Button
                  id="btn-cancel-order"
                  className="w-full"
                  variant="outline"
                  disabled={isCancelling}
                  onClick={handleCancel}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Membatalkan...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                      Batalkan Pesanan
                    </>
                  )}
                </Button>
              )}
            </Card>
          )}

          {/* ── Processing status info ── */}
          {order.status === 'processing' && (
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-sky-700">
                  {order.shipped_simulate_at ? 'Pesanan Dalam Perjalanan' : 'Pesanan Sedang Dikemas'}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.shipped_simulate_at 
                  ? 'Pesanan Anda sedang dikirim oleh kurir. Harap tunggu kedatangannya.' 
                  : 'Toko sedang mempersiapkan pesanan Anda untuk pengiriman. Pesanan akan segera dikirimkan.'}
              </p>
            </Card>
          )}

          {/* ── Shipped — confirm receipt ── */}
          {order.status === 'shipped' && (
            <Card className="p-6 shadow-sm space-y-4">
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
                <Truck className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <p className="font-semibold text-violet-800">Pesanan Anda Sampai</p>
                {order.shipped_at && (
                  <p className="text-xs text-violet-600 mt-1">
                    Sampai pada {new Date(order.shipped_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })} Pukul {new Date(order.shipped_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <Button
                id="btn-confirm-receipt"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isConfirming}
                onClick={handleConfirmReceipt}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selesaikan Pesanan
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Pesanan akan otomatis diselesaikan dalam 7 hari jika tidak ada konfirmasi.
              </p>
            </Card>
          )}

          {/* ── Confirmed ── */}
          {order.status === 'confirmed' && (
            <Card className="p-6 shadow-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <p className="font-semibold text-emerald-700 mb-1">Pesanan Selesai</p>
              {order.confirmed_at && (
                <p className="text-xs text-muted-foreground">
                  Diselesaikan pada {new Date(order.confirmed_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
              <Button
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => router.push('/products')}
              >
                Belanja Lagi
              </Button>
            </Card>
          )}

          {/* ── Cancelled ── */}
          {order.status === 'cancelled' && (
            <Card className="p-6 shadow-sm text-center">
              <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="font-semibold text-rose-700">Pesanan Dibatalkan</p>
              {order.cancelled_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Dibatalkan pada {new Date(order.cancelled_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
