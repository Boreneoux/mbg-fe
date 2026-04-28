'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  ImageOff,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useLocationStore from '@/stores/useLocationStore';
import { useStoreProducts } from '@/features/geolocation/hooks/useStoreProducts';
import { useCart } from '@/features/cart/hooks/useCart';
import { Product } from '@/features/products/types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
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

function ProductCard({
  product,
  storeId
}: {
  product: Product;
  storeId: string;
}) {
  const { addToCart, isLoading } = useCart();

  const primaryImage =
    product.product_images.find(img => img.is_primary)?.image_url ??
    product.product_images[0]?.image_url ??
    null;

  const storeStock =
    product.store_inventories?.find(inv => inv.store_id === storeId)?.stock ??
    0;
  const isOutOfStock = storeStock === 0;

  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-2">
              <ImageOff className="w-8 h-8 text-muted-foreground/40" />
              <span className="text-xs text-muted-foreground/50">
                Belum ada gambar
              </span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3 md:p-4">
        <Badge variant="secondary" className="text-xs mb-1.5">
          {product.category.name}
        </Badge>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-base md:text-lg font-bold text-foreground mb-3">
          {formatPrice(product.price)}
        </p>

        <Button
          size="sm"
          className="w-full gap-1.5 text-xs md:text-sm"
          disabled={isOutOfStock || isLoading}
          onClick={() => addToCart(product.id, 1, storeId)}>
          <ShoppingCart className="w-3.5 h-3.5" />
          {isOutOfStock
            ? 'Out of Stock'
            : isLoading
              ? 'Adding...'
              : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}

function StoreBanner() {
  const status = useLocationStore(s => s.status);
  const selectedStoreName = useLocationStore(s => s.selectedStoreName);

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

function NoLocationBlock() {
  const status = useLocationStore(s => s.status);
  const openLocationDialog = useLocationStore(s => s.openLocationDialog);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Aktifkan Lokasi</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {status === 'error'
          ? 'Gagal mendeteksi lokasi. Izinkan akses GPS atau gunakan alamat tersimpan.'
          : 'Aktifkan lokasi agar kami bisa menampilkan produk segar dari toko terdekat.'}
      </p>
      <Button onClick={openLocationDialog} className="gap-2">
        <MapPin className="w-4 h-4" />
        Atur Lokasi
      </Button>
    </div>
  );
}

function OutOfRangeBlock() {
  const outOfRangeMessage = useLocationStore(s => s.outOfRangeMessage);
  const openLocationDialog = useLocationStore(s => s.openLocationDialog);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Layanan Tidak Tersedia</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-1">
        {outOfRangeMessage ?? 'Tidak ada toko yang dapat melayani lokasi Anda saat ini.'}
      </p>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Coba gunakan alamat lain yang lebih dekat dengan toko kami.
      </p>
      <Button onClick={openLocationDialog} className="gap-2">
        <MapPin className="w-4 h-4" />
        Ganti Lokasi
      </Button>
    </div>
  );
}

export default function NearestStoreProducts() {
  const status = useLocationStore(s => s.status);
  const selectedStoreId = useLocationStore(s => s.selectedStoreId);
  const showProducts = status === 'found' && !!selectedStoreId;
  const { products, isLoading, error } = useStoreProducts(showProducts ? selectedStoreId : null);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-primary mb-1">
              Best picks untukmu
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Products
            </h2>
          </div>
          {showProducts && (
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href="/products">See All</Link>
            </Button>
          )}
        </div>

        {status === 'out_of_range' ? (
          <OutOfRangeBlock />
        ) : !showProducts ? (
          <NoLocationBlock />
        ) : (
          <>
            <StoreBanner />

            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-6 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      storeId={selectedStoreId}
                    />
                  ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
