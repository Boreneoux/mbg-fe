'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useGetOrders } from '@/features/orders/hooks/useGetOrders';
import { useDebounce } from '@/hooks/useDebounce';
import { OrderStatus } from '@/features/orders/types';

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
  const { orders, isLoading, error, pagination } = useGetOrders(page, limit, searchParams.get('search') || undefined);

  const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement>, newPage: number) => {
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
      case 'processing':
      case 'shipped':
        return <Clock className="w-5 h-5 text-primary" />;
      case 'waiting_for_payment':
      case 'waiting_for_confirmation':
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-destructive';
      case 'processing':
      case 'waiting_for_confirmation':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'waiting_for_payment':
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-12 text-center text-destructive">
            <p>{error}</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-muted-foreground mb-6">
              {debouncedSearch ? 'Try a different search term' : 'Start shopping to see your orders here'}
            </p>
            {!debouncedSearch && (
              <Link href="/products" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Shop Now
              </Link>
            )}
          </Card>
        ) : (
          <>
            {orders.map((order) => (
              <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="block group">
                <Card className="p-6 group-hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-bold mb-1">{order.order_number}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.order_items.slice(0, 3).map((item, idx) => (
                            <span key={item.id} className="text-sm">
                              {item.product.name}
                              {idx < Math.min(order.order_items.length - 1, 2) && ','}
                            </span>
                          ))}
                          {order.order_items.length > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{order.order_items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 hidden md:flex">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          ${order.total_price.toFixed(2)}
                        </p>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex md:hidden items-center justify-between mt-4 border-t pt-4">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                      <p className="text-xl font-bold text-foreground">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => handlePageChange(e, page - 1)}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                      // Only show a few pages around current page
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
                              onClick={(e) => handlePageChange(e, p)}
                            >
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
                        onClick={(e) => handlePageChange(e, page + 1)}
                        className={page >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
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
  );
}
