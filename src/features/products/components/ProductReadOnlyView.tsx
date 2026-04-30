'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';
import { Product } from '@/features/products/types';
import { formatCurrencyIDR } from '@/utils/currency';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductReadOnlyViewProps {
  products: Product[];
  isLoading?: boolean;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  page?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function ProductReadOnlyView({ 
  products, 
  isLoading = false,
  pagination,
  page = 1,
  onPageChange,
  search = '',
  onSearchChange,
}: ProductReadOnlyViewProps) {
  const pageNumbers = pagination ? buildPageNumbers(page, pagination.totalPages) : [];
  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))
      ) : products.length === 0 ? (
        <div className="col-span-full rounded-lg border border-dashed p-12 text-center">
          <p className="text-gray-500 text-sm">
            {search ? `No products found for "${search}".` : 'No products available.'}
          </p>
        </div>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
              {product.product_images.length > 0 ? (
                <img
                  src={product.product_images[0].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              {product.product_images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  +{product.product_images.length - 1} more
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {product.description || 'No description'}
              </p>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-500">Price: </span>
                  <span className="font-semibold text-lg">{formatCurrencyIDR(product.price)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Weight: </span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Link href={`/dashboard/products/${product.slug}`} className="w-full">
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
      </div>

      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} products
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p as number)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(page + 1)}
                  aria-disabled={page === pagination.totalPages}
                  className={page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
