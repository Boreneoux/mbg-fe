import Link from 'next/link';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type PlaceholderProduct = {
  id: number;
  name: string;
  unit: string;
  price: number;
  originalPrice?: number;
  // image: string  ← tambahkan saat backend siap, lalu ganti placeholder di bawah
};

const FEATURED_PRODUCTS: PlaceholderProduct[] = [
  { id: 1, name: 'Pisang Organik',     unit: '1 sisir (~5 buah)', price: 15000, originalPrice: 18000 },
  { id: 2, name: 'Susu Segar',         unit: '1 liter',           price: 22000 },
  { id: 3, name: 'Telur Ayam Kampung', unit: '12 butir',          price: 35000, originalPrice: 40000 },
  { id: 4, name: 'Roti Gandum',        unit: '400g',              price: 28000 },
  { id: 5, name: 'Dada Ayam',          unit: '500g',              price: 45000 },
  { id: 6, name: 'Brokoli',            unit: '1 kuntum (~300g)',  price: 12000, originalPrice: 15000 },
  { id: 7, name: 'Greek Yogurt',       unit: '200g',              price: 18000 },
  { id: 8, name: 'Jus Jeruk',          unit: '1 liter',           price: 32000 },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

function discountPercent(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

// ── Skeleton card — shown while data is loading ───────────────────────────────
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardContent className="p-3 md:p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-4" />
        <Skeleton className="h-5 w-1/3 mb-3" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: PlaceholderProduct }) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border">
      {/* Gambar produk — ganti div ini dengan <Image> saat backend siap */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-secondary flex flex-col items-center justify-center gap-2">
          <ImageOff className="w-8 h-8 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground/50">Belum ada gambar</span>

          {product.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5">
              -{discountPercent(product.originalPrice, product.price)}%
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-3 md:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm md:text-base mb-0.5 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base md:text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* TODO: hubungkan cart store */}
        <Button size="sm" className="w-full gap-1.5 text-xs md:text-sm" disabled>
          <ShoppingCart className="w-3.5 h-3.5" />
          Tambah ke Keranjang
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
type Props = {
  isLoading?: boolean;
};

export default function FeaturedProductsSection({ isLoading = false }: Props) {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Pilihan terbaik untukmu</p>
            <h2 className="text-2xl md:text-3xl font-bold">Produk Unggulan</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/products">Lihat Semua</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : FEATURED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
