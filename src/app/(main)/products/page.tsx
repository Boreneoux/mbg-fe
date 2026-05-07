'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useCart } from '@/features/cart/hooks/useCart';
import { useActiveDiscounts } from '@/features/discount/hooks/useActiveDiscounts';
import useLocationStore from '@/stores/useLocationStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ShoppingCart } from 'lucide-react';
import { formatCurrencyIDR } from '@/utils/currency';
import { getBestDiscountPreview } from '@/features/products/pricing';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') ?? undefined;
  const searchParam = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
  const [sort, setSort] = useState<string>('newest');
  const [page, setPage] = useState(1);
  const { categories } = useCategories();
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { discounts } = useActiveDiscounts();
  const { selectedStoreId } = useLocationStore();

  const selectedCategory = useMemo(
    () =>
      categories.find(
        category =>
          category.slug === categoryParam || category.id === categoryParam
      ),
    [categories, categoryParam]
  );

  const categoryId = selectedCategory?.id;

  const { products, meta, isLoading } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category: categoryId,
    sort
  });

  const updateQueryParams = (nextCategorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategorySlug) {
      params.set('category', nextCategorySlug);
    } else {
      params.delete('category');
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    const nextCategoryParam = val === 'all' ? undefined : val;
    updateQueryParams(nextCategoryParam);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catalog</h1>
          <p className="text-gray-600">Find the best products for you</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select
            value={selectedCategory?.slug ?? categoryParam ?? 'all'}
            onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const primaryImage =
                product.product_images.find(img => img.is_primary)?.image_url ||
                product.product_images[0]?.image_url ||
                '/placeholder.png';

              const totalStock = product.store_inventories?.reduce((acc, inv) => acc + inv.stock, 0) || 0;
              const nearestStoreStock = selectedStoreId 
                ? (product.store_inventories?.find(inv => inv.store_id === selectedStoreId)?.stock || 0)
                : null;
              const displayStock = selectedStoreId ? nearestStoreStock : totalStock;
              const isOutOfStock = displayStock === 0;

              const defaultStoreId = selectedStoreId || product.store_inventories?.find(inventory => inventory.stock > 0)?.store_id;
              const discountPreview = getBestDiscountPreview(
                product,
                discounts,
                1,
                defaultStoreId
              );

              return (
                <div
                  key={product.id}
                  className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block">
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {discountPreview && (
                        <div className="absolute left-2 top-2 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                          {discountPreview.badge}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {product.category.name}
                      </p>
                      <Link
                        href={`/products/${product.slug}`}
                        className="block">
                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-green-700">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-base font-bold text-green-600">
                            {formatCurrencyIDR(
                              discountPreview?.discountedPrice ?? product.price
                            )}
                          </p>
                          {discountPreview &&
                            discountPreview.discountedPrice !== null && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatCurrencyIDR(product.price)}
                              </p>
                            )}
                          {(!discountPreview ||
                            discountPreview.discountedPrice === null) && (
                            <p
                              className="invisible text-xs text-muted-foreground"
                              aria-hidden="true">
                              {formatCurrencyIDR(product.price)}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {selectedStoreId 
                            ? `Stock: ${nearestStoreStock}`
                            : `Stock: ${totalStock}`}
                        </span>
                      </div>
                      <p
                        className={`min-h-4 text-xs font-medium ${
                          discountPreview?.description
                            ? 'line-clamp-1 text-rose-600'
                            : 'invisible text-rose-600'
                        }`}
                        aria-hidden={!discountPreview?.description}>
                        {discountPreview?.description ?? 'Discount placeholder'}
                      </p>
                    </div>

                    <Button
                      type="button"
                      className="mt-auto w-full"
                      size="sm"
                      disabled={
                        isOutOfStock || !defaultStoreId || isAddingToCart
                      }
                      onClick={() => {
                        if (!defaultStoreId) return;
                        addToCart(product.id, 1, defaultStoreId);
                      }}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Tambah
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="pt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: meta.totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={e => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (page < meta.totalPages) setPage(page + 1);
                      }}
                      className={
                        page >= meta.totalPages
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
  );
}
