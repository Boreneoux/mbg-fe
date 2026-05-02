import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

type QuantityControlProps = {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  isLoading?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  allowInput?: boolean;
  className?: string;
};

export function QuantityControl({
  quantity,
  onQuantityChange,
  isLoading = false,
  minQuantity = 1,
  maxQuantity = Infinity,
  allowInput = false,
  className,
}: QuantityControlProps) {
  const canDecrement = quantity > minQuantity;
  const canIncrement = quantity < maxQuantity;

  return (
    <div className={`flex items-center border border-border rounded-lg ${className ?? ''}`}>
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
      {allowInput ? (
        <Input
          type="number"
          min={minQuantity}
          max={Number.isFinite(maxQuantity) ? maxQuantity : undefined}
          value={quantity}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (Number.isNaN(nextValue)) {
              return;
            }

            const clampedValue = Math.min(Math.max(nextValue, minQuantity), maxQuantity);
            onQuantityChange(clampedValue);
          }}
          disabled={isLoading}
          className="h-8 w-16 rounded-none border-0 px-2 text-center font-semibold text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      ) : (
        <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
      )}
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
