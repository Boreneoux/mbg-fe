'use client';

import Link from 'next/link';
import useAuthStore from '@/stores/useAuthStore';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductTable } from '@/features/products/components/ProductTable';
import { ProductReadOnlyView } from '@/features/products/components/ProductReadOnlyView';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardProductsPage() {
  const user = useAuthStore((s) => s.user);
  const { products, meta, isLoading, refetch, page, setPage, search, setSearch } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        {user?.role === 'super_admin' && (
          <Link href="/dashboard/products/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </Link>
        )}
      </div>

      {user?.role === 'super_admin' ? (
        <ProductTable
          products={products}
          isLoading={isLoading}
          onRefetch={refetch}
          pagination={meta}
          page={page}
          onPageChange={setPage}
          search={search}
          onSearchChange={setSearch}
        />
      ) : (
        <ProductReadOnlyView
          products={products}
          isLoading={isLoading}
          pagination={meta}
          page={page}
          onPageChange={setPage}
          search={search}
          onSearchChange={setSearch}
        />
      )}
    </div>
  );
}
