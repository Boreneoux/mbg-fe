'use client';

import Link from 'next/link';
import { ShoppingCart, ImageOff, MapPin, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useLocationStore from '@/stores/useLocationStore';
import { useStoreProducts } from '@/features/geolocation/hooks/useStoreProducts';
import { FALLBACK_STORE_ID } from '@/mocks/handlers/stores.handlers';
import { Product } from '@/features/products/types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardContent className="p-3 md:p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/3 mb-4" />
        <Skeleton className="h-5 w-1/3 mb-3" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-secondary flex flex-col items-center justify-center gap-2">
          <ImageOff className="w-8 h-8 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground/50">Belum ada gambar</span>
        </div>
      </Link>

      <CardContent className="p-3 md:p-4">
        <Badge variant="secondary" className="text-xs mb-1.5">
          {product.category.name}
        </Badge>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-base md:text-lg font-bold text-foreground mb-3">
          {formatPrice(product.price)}
        </p>

        <Button size="sm" className="w-full gap-1.5 text-xs md:text-sm" disabled>
          <ShoppingCart className="w-3.5 h-3.5" />
          Tambah ke Keranjang
        </Button>
      </CardContent>
    </Card>
  );
}

function StoreBanner() {
  const status = useLocationStore((s) => s.status);
  const selectedStoreName = useLocationStore((s) => s.selectedStoreName);
  const outOfRangeMessage = useLocationStore((s) => s.outOfRangeMessage);

  if (status === 'out_of_range') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 mb-6 text-sm">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-yellow-800">Lokasi di luar jangkauan</p>
          <p className="text-yellow-700 mt-0.5">{outOfRangeMessage}</p>
          <p className="text-yellow-700 mt-1">
            Menampilkan produk dari toko utama:{' '}
            <span className="font-medium">{selectedStoreName}</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === 'denied' || status === 'error') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 mb-6 text-sm">
        <Info className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-muted-foreground">
          Menampilkan produk dari toko utama:{' '}
          <span className="font-medium text-foreground">{selectedStoreName}</span>
        </p>
      </div>
    );
  }

  if (status === 'found' && selectedStoreName) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          Produk dari toko terdekat:{' '}
          <span className="font-medium text-foreground">{selectedStoreName}</span>
        </p>
      </div>
    );
  }

  return null;
}

export default function NearestStoreProducts() {
  const selectedStoreId = useLocationStore((s) => s.selectedStoreId);
  // Always fetch from at least the fallback store so the section is never blank
  const effectiveStoreId = selectedStoreId ?? FALLBACK_STORE_ID;
  const { products, isLoading, error } = useStoreProducts(effectiveStoreId);

  const showSkeletons = isLoading;

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-primary mb-1">
              Pilihan terbaik untukmu
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">Produk Unggulan</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/products">Lihat Semua</Link>
          </Button>
        </div>

        <StoreBanner />

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-6 text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {showSkeletons
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
