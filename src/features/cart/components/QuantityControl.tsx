import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

type QuantityControlProps = {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  isLoading?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
};

export function QuantityControl({
  quantity,
  onQuantityChange,
  isLoading = false,
  minQuantity = 1,
  maxQuantity = Infinity,
}: QuantityControlProps) {
  const canDecrement = quantity > minQuantity;
  const canIncrement = quantity < maxQuantity;

  return (
    <div className="flex items-center border border-border rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={!canDecrement || isLoading}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={!canIncrement || isLoading}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
