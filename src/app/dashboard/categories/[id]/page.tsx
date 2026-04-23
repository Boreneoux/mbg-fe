'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useCategory } from '@/features/categories/hooks/useCategory';
import { useFormCategory } from '@/features/categories/hooks/useFormCategory';
import { deleteCategoryApi } from '@/features/categories/api/deleteCategory.api';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryId = parseInt(id);
  const { category, isLoading, error } = useCategory(categoryId);
  const { form, onSubmit, isSubmitting } = useFormCategory('edit', category ?? undefined);

  const isSuperAdmin = user?.role === 'super_admin';
  const isStoreAdmin = user?.role === 'store_admin';
  const isReadOnly = !isSuperAdmin || isLoading;

  const handleDelete = async () => {
    if (!isSuperAdmin || !category) return;

    setIsDeleting(true);
    try {
      await deleteCategoryApi(category.id);
      toast.success('Category deleted successfully');
      router.push('/dashboard/categories');
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? 'Failed to delete category')
        : 'An unexpected error occurred';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-32 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">{error || 'Category not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSuperAdmin && !isStoreAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to view this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-gray-600 mt-1">
              {isSuperAdmin && !isReadOnly ? 'Edit category details' : 'View category'}
            </p>
          </div>

          {isSuperAdmin && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              category={category}
              isReadOnly={isReadOnly}
              submitLabel={isReadOnly ? undefined : 'Update Category'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{category.name}</strong>"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
