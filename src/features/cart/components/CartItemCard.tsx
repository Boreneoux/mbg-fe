import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { QuantityControl } from './QuantityControl';
import type { CartItem } from '@/features/cart/types';
import { formatCurrencyIDR } from '@/utils/currency';

type CartItemCardProps = {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
  onUpdateQuantity: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  isLoading?: boolean;
};

export function CartItemCard({
  item,
  isSelected,
  onToggle,
  onUpdateQuantity,
  onRemove,
  isLoading = false
}: CartItemCardProps) {
  const { product } = item;
  const primaryImage = product.product_images.find(img => img.is_primary);

  return (
    <Card className="p-4">
      <div className="flex gap-4 items-start">
        <div className="pt-1">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onToggle}
            disabled={isLoading}
          />
        </div>

        <Link href={`/products/${product.slug}`} className="shrink-0">
          <img
            src={primaryImage?.image_url || '/placeholder.png'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">
            {product.weight}g
          </p>
          <p className="text-lg font-bold">{formatCurrencyIDR(Number(product.price))}</p>
        </div>

        <div className="flex flex-col items-end justify-between self-stretch">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            aria-label="Remove item">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>

          <QuantityControl
            quantity={item.quantity}
            onQuantityChange={newQuantity =>
              onUpdateQuantity(item.id, newQuantity)
            }
            isLoading={isLoading}
            minQuantity={1}
          />
        </div>
      </div>
    </Card>
  );
}
