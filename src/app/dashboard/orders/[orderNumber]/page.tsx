'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetOrder } from '@/features/orders/hooks/useGetOrder';
import { ArrowLeft, Package, MapPin, CreditCard, Loader2, Store, XCircle, CheckCircle, Truck, RefreshCcw } from 'lucide-react';
import { useAdminOrderActions } from '@/features/orders/hooks/useAdminOrderActions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIDR } from '@/utils/currency';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderNumber = Array.isArray(params.orderNumber) ? params.orderNumber[0] : params.orderNumber;
  const router = useRouter();

  const { order, isLoading, error, refetch } = useGetOrder(orderNumber as string, true);
  const { confirmPayment, processShipment, shipOrder, cancelOrder, syncPayment, isUpdating } = useAdminOrderActions(orderNumber as string, refetch);

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
        <Button onClick={() => router.push('/dashboard/orders')}>Back to Orders</Button>
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

  const formatText = (text: string) => {
    if (!text) return '';
    return text.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatCurrency = (amount: number | string) => {
    return formatCurrencyIDR(Number(amount));
  };

  const subtotal = Number(order.total_price) + Number(order.total_discount) - Number(order.shipping_cost);

  const canCancel = ['waiting_for_payment', 'waiting_for_confirmation'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push('/dashboard/orders')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="mb-6 mt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <Badge className={`${getStatusColor(order.status)} font-bold`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            {formatText(order.status)}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {order.store && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-medium">Store: {order.store.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Order Items</h2>
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
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
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

          {/* Shipping Details for Admin */}
          {order.address && (
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Shipping Details</h2>
              </div>
              <div className="text-muted-foreground text-sm">
                <p className="font-semibold text-foreground mb-1">Customer: {order.address.recipient_name}</p>
                <p className="font-medium text-foreground">Phone: {order.address.phone}</p>
                <div className="mt-3">
                  <p className="font-medium text-foreground mb-1">Address Label: {order.address.label || 'None'}</p>
                  <p>{order.address.address}</p>
                  <p>
                    {order.address.district?.name ? `${order.address.district.name}, ` : ''}
                    {order.address.city?.name}
                  </p>
                  <p>
                    {order.address.province?.name} {order.address.postal_code || ''}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary & Admin Actions */}
        <div>
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {Number(order.total_discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.total_discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
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
              <span>Paid with {formatText(order.payment_method)}</span>
            </div>

            {/* Midtrans status */}
            {order.midtrans_status && (
              <p className="text-xs text-muted-foreground mt-2">
                Gateway status: <span className="font-semibold capitalize">{order.midtrans_status}</span>
              </p>
            )}
          </Card>

          <Card className="p-6 shadow-sm mt-6">
            <h2 className="text-lg font-bold mb-4">Admin Controls</h2>
            <div className="space-y-3">
              {/* Check Payment Status */}
              {order.status === 'waiting_for_payment' && (
                <Button
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                  onClick={syncPayment}
                  disabled={isUpdating}
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Check Payment Status
                </Button>
              )}

              {/* Confirm payment → processing */}
              {['waiting_for_confirmation', 'waiting_for_payment'].includes(order.status) && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={confirmPayment}
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Payment (Start Packing)
                </Button>
              )}

              {/* Start Shipment Timer */}
              {order.status === 'processing' && !order.shipped_simulate_at && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={processShipment}
                  disabled={isUpdating}
                >
                  <Truck className="w-5 h-5 mr-2" />
                  Send to Courier (Start Delivery)
                </Button>
              )}

              {/* Auto-ship timer info */}
              {order.status === 'processing' && order.shipped_simulate_at && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center bg-muted/50 p-3 rounded-md">
                    Auto-ship scheduled at{' '}
                    <span className="font-semibold text-foreground">
                      {new Date(order.shipped_simulate_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              )}

              {/* Cancel */}
              {canCancel && (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={cancelOrder}
                  disabled={isUpdating}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel Order
                </Button>
              )}

              {!canCancel && !['waiting_for_confirmation', 'processing'].includes(order.status) && (
                <p className="text-sm text-muted-foreground text-center py-2 italic">
                  No further actions available for this status.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
