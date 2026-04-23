'use client';

import useAuthStore from '@/stores/useAuthStore';
import { useFormCategory } from '@/features/categories/hooks/useFormCategory';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateCategoryPage() {
  const user = useAuthStore((s) => s.user);
  const { form, onSubmit, isSubmitting } = useFormCategory('create');

  // Protect: only super_admin can create categories
  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to create categories.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Category</h1>
        <p className="text-gray-600 mt-1">Add a new product category</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>Fill in the details below to create a new category</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
