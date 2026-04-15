import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type OrderSummaryProps = {
  subtotal: number;
  deliveryFee: number;
  onCheckout: () => void;
  onContinueShopping: () => void;
  isLoading?: boolean;
};

export function OrderSummary({
  subtotal,
  deliveryFee,
  onCheckout,
  onContinueShopping,
  isLoading = false,
}: OrderSummaryProps) {
  const total = subtotal + deliveryFee;

  return (
    <div>
      <Card className="p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={isLoading}
        >
          Proceed to Checkout
        </Button>

        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={onContinueShopping}
          disabled={isLoading}
        >
          Continue Shopping
        </Button>
      </Card>
    </div>
  );
}
