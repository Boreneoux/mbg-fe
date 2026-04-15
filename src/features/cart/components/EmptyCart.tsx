import { ReactNode } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type EmptyCartProps = {
  onShopClick: () => void;
};

export function EmptyCart({ onShopClick }: EmptyCartProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-8 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items to your cart to get started</p>
        <Button onClick={onShopClick}>Shop Now</Button>
      </Card>
    </div>
  );
}
