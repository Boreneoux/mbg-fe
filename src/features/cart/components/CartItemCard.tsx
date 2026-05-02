import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
            {product.weight} kg
          </p>
          
          {item.discount_amount && item.discount_amount > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">Diskon</Badge>
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrencyIDR(item.original_total_price ?? (Number(product.price) * item.quantity))}
                </span>
              </div>
              <p className="text-lg font-bold">
                {formatCurrencyIDR(item.total_price ?? (Number(product.price) * item.quantity))}
              </p>
            </div>
          ) : item.is_bogo_item ? (
             <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500 hover:bg-orange-600 px-1.5 py-0 text-[10px]">Beli 1 Gratis 1</Badge>
              </div>
              <p className="text-lg font-bold">
                {formatCurrencyIDR(item.total_price ?? (Number(product.price) * item.quantity))}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold">
              {formatCurrencyIDR(item.total_price ?? (Number(product.price) * item.quantity))}
            </p>
          )}
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
            allowInput={true}
          />
        </div>
      </div>
    </Card>
  );
}
