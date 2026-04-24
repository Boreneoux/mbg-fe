'use client';

import Link from 'next/link';
import useAuthStore from '@/stores/useAuthStore';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { CategoryList } from '@/features/categories/components/CategoryList';
import { deleteCategoryApi } from '@/features/categories/api/deleteCategory.api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const { categories, isLoading, error, refetch } = useCategories();

  const isSuperAdmin = user?.role === 'super_admin';
  const isStoreAdmin = user?.role === 'store_admin';

  if (!isSuperAdmin && !isStoreAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to view categories.</p>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategoryApi(id);
      toast.success('Category deleted successfully');
      if (refetch) refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin ? 'Manage your product categories' : 'View available categories'}
          </p>
        </div>
        {isSuperAdmin && (
          <Link href="/dashboard/categories/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </Link>
        )}
      </div>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        error={error}
        canEdit={isSuperAdmin}
        canDelete={isSuperAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}
