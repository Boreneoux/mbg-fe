'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useFormCategory } from '@/features/categories/hooks/useFormCategory';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CreateCategoryPage() {
  const router = useRouter();
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
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/categories')}
        className="mb-2 -ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Categories
      </Button>

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
