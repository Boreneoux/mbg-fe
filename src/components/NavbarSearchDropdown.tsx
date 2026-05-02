'use client';

import Image from 'next/image';
import { ImageOff, Search } from 'lucide-react';
import { Product } from '@/features/products/types';
import { formatCurrencyIDR } from '@/utils/currency';
import { Skeleton } from '@/components/ui/skeleton';

interface NavbarSearchDropdownProps {
  query: string;
  products: Product[];
  isLoading: boolean;
  onItemClick: (slug: string) => void;
  onSeeAll: () => void;
}

export function NavbarSearchDropdown({
  query,
  products,
  isLoading,
  onItemClick,
  onSeeAll,
}: NavbarSearchDropdownProps) {
  const hasResults = products.length > 0;
  const showEmpty = !isLoading && !hasResults;

  return (
    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-border shadow-lg shadow-black/8 overflow-hidden">
      {isLoading && (
        <ul className="py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="w-10 h-10 rounded-md shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
              <Skeleton className="h-3.5 w-14 rounded" />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && hasResults && (
        <ul className="py-1">
          {products.map((product) => {
            const primaryImage =
              product.product_images.find((img) => img.is_primary)?.image_url ??
              product.product_images[0]?.image_url;

            return (
              <li key={product.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onItemClick(product.slug);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors text-left"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-md border border-border bg-secondary/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-0.5"
                      />
                    ) : (
                      <ImageOff className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      in {product.category.name}
                    </p>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-semibold text-primary shrink-0">
                    {formatCurrencyIDR(product.price)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center gap-1.5 py-6 text-muted-foreground">
          <Search className="w-5 h-5 opacity-40" />
          <p className="text-sm">Tidak ada hasil untuk &quot;{query}&quot;</p>
        </div>
      )}

      {/* See all footer */}
      {!isLoading && (
        <div className="border-t border-border">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSeeAll();
            }}
            className="w-full px-4 py-2.5 text-sm text-primary font-medium hover:bg-secondary/60 transition-colors text-center"
          >
            Lihat semua hasil untuk &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
