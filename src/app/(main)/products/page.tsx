'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { formatCurrencyIDR } from '@/utils/currency';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>('newest');
  const [page, setPage] = useState(1);

  const { products, meta, isLoading } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category,
    sort,
  });

  const { categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val === 'all' ? undefined : parseInt(val));
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select value={category?.toString() || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const primaryImage = product.product_images.find(img => img.is_primary)?.image_url 
                                || product.product_images[0]?.image_url 
                                || '/placeholder.png';
              
              const totalStock = product.store_inventories?.reduce((acc, inv) => acc + inv.qty, 0) || 0;
              const isOutOfStock = totalStock === 0;

              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group relative block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-square w-full relative">
                    <img 
                      src={primaryImage} 
                      alt={product.name}
                      className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{product.category.name}</p>
                    <p className="font-bold text-lg text-green-600">{formatCurrencyIDR(product.price)}</p>
                  </div>
                </Link>
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
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: meta.totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < meta.totalPages) setPage(page + 1);
                      }}
                      className={page >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}
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
