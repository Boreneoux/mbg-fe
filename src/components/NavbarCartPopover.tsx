'use client';

import Link from 'next/link';
import { ShoppingCart, ShoppingBag, LogIn } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIDR } from '@/utils/currency';
import type { Cart } from '@/features/cart/types';

const MAX_PREVIEW_ITEMS = 4;

interface NavbarCartPopoverProps {
  cart: Cart | null;
  isLoggedIn: boolean;
}

function getPrimaryImage(images: { image_url: string; is_primary: boolean }[]): string | null {
  return (images.find(i => i.is_primary) ?? images[0])?.image_url ?? null;
}

export function NavbarCartPopover({ cart, isLoggedIn }: NavbarCartPopoverProps) {
  const items = cart?.cart_items ?? [];
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const previewItems = items.slice(0, MAX_PREVIEW_ITEMS);
  const overflowCount = items.length - MAX_PREVIEW_ITEMS;

  const total = items.reduce(
    (sum, item) => sum + Number(item.total_price ?? (Number(item.product.price) * item.quantity)),
    0,
  );

  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Link href={isLoggedIn ? '/cart' : '/auth/login'} className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </Badge>
            )}
          </Button>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent align="center" className="w-80 p-0 shadow-lg">
        <div className="px-4 py-3 font-semibold text-sm border-b border-border">
          Keranjang Belanja
        </div>

        {/* Not logged in → prompt to login */}
        {!isLoggedIn ? (
          <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                Login dulu, yuk!
              </p>
              <p className="text-xs text-muted-foreground">
                Masuk ke akunmu untuk mulai belanja dan lihat isi cart-mu.
              </p>
            </div>
            <Button asChild size="sm" className="w-full gap-2 mt-1">
              <Link href="/auth/login">
                <LogIn className="w-4 h-4" />
                Masuk Sekarang
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                Daftar gratis
              </Link>
            </p>
          </div>
        ) : cartCount === 0 ? (
          /* Logged in but cart is empty */
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <ShoppingBag className="w-10 h-10 opacity-30" />
            <p className="text-sm">Keranjangmu masih kosong</p>
          </div>
        ) : (
          /* Logged in with items */
          <>
            <ul className="divide-y divide-border">
              {previewItems.map(item => {
                const imageUrl = getPrimaryImage(item.product.product_images);
                return (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-12 h-12 rounded-md bg-secondary shrink-0 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrencyIDR(Number(item.product.price))}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0 text-primary">
                      {formatCurrencyIDR(item.total_price ?? (Number(item.product.price) * item.quantity))}
                    </p>
                  </li>
                );
              })}
            </ul>

            {overflowCount > 0 && (
              <p className="px-4 py-2 text-xs text-muted-foreground bg-secondary/40">
                + {overflowCount} produk lainnya di keranjang
              </p>
            )}

            <Separator />

            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-primary">{formatCurrencyIDR(total)}</p>
              </div>
              <Button asChild size="sm" className="shadow-sm shadow-primary/20">
                <Link href="/cart">Lihat Keranjang</Link>
              </Button>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
