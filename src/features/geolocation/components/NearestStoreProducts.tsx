'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  ImageOff,
  MapPin,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/currency';
import useLocationStore from '@/stores/useLocationStore';
import { useStoreProducts } from '@/features/geolocation/hooks/useStoreProducts';
import { useNearestStore } from '@/features/geolocation/hooks/useNearestStore';
import { useCart } from '@/features/cart/hooks/useCart';
import { Product } from '@/features/products/types';


// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-white">
      <Skeleton className="aspect-square w-full" />
      <div className="p-2 sm:p-2.5">
        <Skeleton className="h-2.5 w-1/2 mb-1.5 rounded-full" />
        <Skeleton className="h-3 w-4/5 mb-1" />
        <Skeleton className="h-3 w-3/5 mb-2.5" />
        <Skeleton className="h-7 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  storeId,
}: {
  product: Product;
  storeId: string;
}) {
  const { addToCart, isLoading } = useCart();

  const primaryImage =
    product.product_images.find((img) => img.is_primary)?.image_url ??
    product.product_images[0]?.image_url ??
    null;

  const storeStock =
    product.store_inventories?.find((inv) => inv.store_id === storeId)?.stock ?? 0;
  const isOutOfStock = storeStock === 0;

  return (
    <div className="group flex flex-col rounded-xl overflow-hidden border border-border bg-white hover:border-primary/40 hover:shadow-md hover:shadow-primary/8 transition-all duration-200">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-gray-50 overflow-hidden shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-contain p-1.5 transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-1">
            <ImageOff className="w-5 h-5 text-muted-foreground/30" />
          </div>
        )}

        {/* Category chip */}
        <span className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm text-foreground text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-border/60 leading-none max-w-[75%] truncate">
          {product.category.name}
        </span>

        {/* Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="bg-black/70 text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium">
              Habis
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2 pt-1.5 pb-2 sm:px-2.5 sm:pt-2 sm:pb-2.5">
        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <p className="text-[11px] sm:text-xs font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </p>
        </Link>

        {/* Low stock badge */}
        {!isOutOfStock && storeStock <= 5 && (
          <p className="text-[9px] sm:text-[10px] text-orange-500 font-medium mb-1 leading-none">
            Sisa {storeStock} lagi!
          </p>
        )}

        {/* Price */}
        <p className="text-xs sm:text-sm font-bold text-foreground mt-auto mb-1.5">
          {formatPrice(product.price)}
        </p>

        {/* Add to cart button */}
        <Button
          size="sm"
          className="w-full h-7 text-[10px] sm:text-xs gap-1 rounded-lg"
          disabled={isOutOfStock || isLoading}
          onClick={() => addToCart(product.id, 1, storeId)}
        >
          <ShoppingCart className="w-3 h-3 shrink-0" />
          {isOutOfStock ? 'Habis' : isLoading ? 'Adding…' : 'Tambah'}
        </Button>
      </div>
    </div>
  );
}

// ── Store Banner ──────────────────────────────────────────────────────────────
function StoreBanner() {
  const status = useLocationStore((s) => s.status);
  const selectedStoreName = useLocationStore((s) => s.selectedStoreName);

  if (status === 'found' && selectedStoreName) {
    return (
      <div className="inline-flex items-center gap-1.5 mb-4 bg-primary/8 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        Dari toko: <span className="font-semibold">{selectedStoreName}</span>
      </div>
    );
  }
  return null;
}

// ── No Location Block ─────────────────────────────────────────────────────────
function NoLocationBlock() {
  const status = useLocationStore((s) => s.status);
  const openLocationDialog = useLocationStore((s) => s.openLocationDialog);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-2xl border border-dashed border-border bg-secondary/30">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
        <MapPin className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-sm font-semibold mb-1.5">Aktifkan Lokasi</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-4 leading-relaxed">
        {status === 'error'
          ? 'Gagal mendeteksi lokasi. Izinkan akses GPS atau gunakan alamat tersimpan.'
          : 'Aktifkan lokasi agar kami bisa menampilkan produk segar dari toko terdekat.'}
      </p>
      <Button onClick={openLocationDialog} size="sm" className="gap-2 rounded-full px-5 text-xs">
        <MapPin className="w-3.5 h-3.5" />
        Atur Lokasi
      </Button>
    </div>
  );
}

// ── Out of Range Block ────────────────────────────────────────────────────────
function OutOfRangeBlock() {
  const outOfRangeMessage = useLocationStore((s) => s.outOfRangeMessage);
  const openLocationDialog = useLocationStore((s) => s.openLocationDialog);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-2xl border border-dashed border-destructive/30 bg-destructive/5">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold mb-1.5">Layanan Tidak Tersedia</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-1 leading-relaxed">
        {outOfRangeMessage ?? 'Tidak ada toko yang dapat melayani lokasi Anda saat ini.'}
      </p>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">
        Coba gunakan alamat lain yang lebih dekat dengan toko kami.
      </p>
      <Button onClick={openLocationDialog} size="sm" variant="destructive" className="gap-2 rounded-full px-5 text-xs">
        <MapPin className="w-3.5 h-3.5" />
        Ganti Lokasi
      </Button>
    </div>
  );
}

// ── Section Root ──────────────────────────────────────────────────────────────
export default function NearestStoreProducts() {
  const status = useLocationStore((s) => s.status);
  const selectedStoreId = useLocationStore((s) => s.selectedStoreId);
  const selectedStoreSlug = useLocationStore((s) => s.selectedStoreSlug);
  const coordinates = useLocationStore((s) => s.coordinates);
  const showProducts = status === 'found' && !!selectedStoreId && !!selectedStoreSlug;

  const { resolveNearestStoreSilently } = useNearestStore();

  useEffect(() => {
    if (status === 'found' && selectedStoreId && !selectedStoreSlug && coordinates) {
      resolveNearestStoreSilently(coordinates.lat, coordinates.lng);
    }
  }, [status, selectedStoreId, selectedStoreSlug, coordinates, resolveNearestStoreSilently]);

  const { products, isLoading, error } = useStoreProducts(showProducts ? selectedStoreSlug : null);

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 md:mb-5">
          <div>
            <p className="text-xs font-medium text-primary mb-0.5">
              Best picks untukmu
            </p>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight">
              Featured Products
            </h2>
          </div>
          {showProducts && (
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2 transition-colors shrink-0"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {showProducts && <StoreBanner />}

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {status === 'out_of_range' ? (
          <OutOfRangeBlock />
        ) : !showProducts ? (
          <NoLocationBlock />
        ) : (
          /* 2 cols mobile → 3 sm → 4 md → 5 lg */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeId={selectedStoreId}
                  />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
