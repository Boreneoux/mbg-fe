import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type OrderNotFoundProps = {
  onBack: () => void;
};

export function OrderNotFound({ onBack }: OrderNotFoundProps) {
  return (
    <Card className="max-w-md mx-auto p-8 text-center">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
      <h2 className="text-2xl font-bold mb-2">Order not found</h2>
      <p className="text-muted-foreground mb-6">This order cannot be accessed or does not exist.</p>
      <Button onClick={onBack}>Back to Orders</Button>
    </Card>
  );
}
