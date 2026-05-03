import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIDR } from '@/utils/currency';

type OrderSummaryProps = {
  subtotal: number;
  originalSubtotal?: number;
  productDiscount?: number;
  deliveryFee?: number | null;
  onCheckout: () => void;
  onContinueShopping: () => void;
  isLoading?: boolean;
};

export function OrderSummary({
  subtotal,
  originalSubtotal,
  productDiscount,
  deliveryFee,
  onCheckout,
  onContinueShopping,
  isLoading = false,
}: OrderSummaryProps) {
  const total = subtotal + (deliveryFee || 0);

  return (
    <div>
      <Card className="p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-4">Rincian</h2>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatCurrencyIDR(originalSubtotal ?? subtotal)}</span>
          </div>
          {productDiscount !== undefined && productDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Diskon Produk</span>
              <span>-{formatCurrencyIDR(productDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ongkos Kirim</span>
            <span className="font-semibold text-right">
              {deliveryFee === undefined || deliveryFee === null 
                ? <span className="text-sm font-normal text-muted-foreground">Dihitung saat checkout</span> 
                : formatCurrencyIDR(deliveryFee)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatCurrencyIDR(total)}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={isLoading || subtotal === 0}
        >
          Checkout Sekarang
        </Button>

        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={onContinueShopping}
          disabled={isLoading}
        >
          Lanjutkan Belanja
        </Button>
      </Card>
    </div>
  );
}
