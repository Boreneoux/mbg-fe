'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Truck,
  CreditCard,
  RefreshCw
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

import { useGetOrders } from '@/features/orders/hooks/useGetOrders';
import { useDebounce } from '@/hooks/useDebounce';
import { OrderStatus } from '@/features/orders/types';
import { formatCurrencyIDR } from '@/utils/currency';
import { translateOrderStatus } from '@/features/orders/utils';

export default function OrderListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state logic
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (debouncedSearch) {
      if (params.get('search') !== debouncedSearch) {
        params.set('search', debouncedSearch);
        params.set('page', '1'); // Reset to page 1 on new search
        changed = true;
      }
    } else {
      if (params.has('search')) {
        params.delete('search');
        params.set('page', '1'); // Reset to page 1 on cleared search
        changed = true;
      }
    }

    if (changed) {
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  // Handle data fetching via hook
  const { orders, isLoading, error, pagination } = useGetOrders(
    page,
    limit,
    searchParams.get('search') || undefined
  );

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    newPage: number
  ) => {
    e.preventDefault();
    if (newPage < 1 || newPage > pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-violet-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-sky-500" />;
      case 'waiting_for_payment':
      case 'waiting_for_confirmation':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-600 text-white hover:bg-emerald-700';
      case 'cancelled':
        return 'bg-rose-600 text-white hover:bg-rose-700';
      case 'processing':
      case 'waiting_for_confirmation':
        return 'bg-sky-600 text-white hover:bg-sky-700';
      case 'shipped':
        return 'bg-violet-600 text-white hover:bg-violet-700';
      case 'waiting_for_payment':
        return 'bg-amber-500 text-white hover:bg-amber-600';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold">Pesanan Saya</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lihat dan lacak riwayat pesanan kamu
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor pesanan..."
              className="pl-10 h-10 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
                <p>{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-1">Belum Ada Pesanan</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {debouncedSearch
                    ? 'Coba cari dengan kata kunci lain'
                    : 'Mulai belanja untuk melihat pesanan kamu di sini'}
                </p>
                {!debouncedSearch && (
                  <Button asChild size="sm">
                    <Link href="/products">Belanja Sekarang</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders.map(order => (
                    <Link
                      href={`/account/orders/${order.id}`}
                      key={order.id}
                      className="block group">
                      <div className="rounded-xl border bg-card p-5 group-hover:border-primary/50 group-hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              {getStatusIcon(order.status)}
                            </div>
                            
                            {/* Product Preview Image */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted border">
                              {(() => {
                                const firstItem = order.order_items[0];
                                const primaryImage = firstItem?.product?.product_images?.find((img: any) => img.is_primary)?.image_url 
                                                  || firstItem?.product?.product_images?.[0]?.image_url;
                                
                                return primaryImage ? (
                                  <img
                                    src={primaryImage}
                                    alt={firstItem?.product?.name || 'Product'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground/50" />
                                  </div>
                                );
                              })()}
                            </div>

                            <div>
                              <h3 className="font-bold text-sm md:text-base mb-1">{order.order_number}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {new Date(order.created_at).toLocaleDateString(
                                  'id-ID',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }
                                )}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {order.order_items.slice(0, 3).map((item, idx) => (
                                  <span key={item.id} className="text-xs text-muted-foreground">
                                    {item.product.name}
                                    {idx <
                                      Math.min(order.order_items.length - 1, 2) &&
                                      ','}
                                  </span>
                                ))}
                                {order.order_items.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{order.order_items.length - 3} lagi
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary mb-1">
                                {formatCurrencyIDR(Number(order.total_price))}
                              </p>
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(order.status)} border-transparent font-semibold px-2.5 py-0.5 text-[10px]`}>
                                {translateOrderStatus(order.status)}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex md:hidden items-center justify-between pt-4 border-t border-border mt-2">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(order.status)} border-transparent font-semibold px-2.5 py-0.5 text-[10px]`}>
                              {translateOrderStatus(order.status)}
                            </Badge>
                            <p className="text-lg font-bold text-primary">
                              {formatCurrencyIDR(Number(order.total_price))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={e => handlePageChange(e, page - 1)}
                            className={
                              page <= 1 ? 'pointer-events-none opacity-50' : ''
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: pagination.totalPages },
                          (_, i) => i + 1
                        ).map(p => {
                          if (
                            p === 1 ||
                            p === pagination.totalPages ||
                            (p >= page - 1 && p <= page + 1)
                          ) {
                            return (
                              <PaginationItem key={p}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === p}
                                  onClick={e => handlePageChange(e, p)}>
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (p === page - 2 || p === page + 2) {
                            return (
                              <PaginationItem key={p}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={e => handlePageChange(e, page + 1)}
                            className={
                              page >= pagination.totalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
