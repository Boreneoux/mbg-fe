'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';
import { ProductForm } from '@/features/products/components/ProductForm';
import { CreateProductFormValues, UpdateProductFormValues } from '@/features/products/schemas/product.schema';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { form, onSubmit, isSubmitting } = useCreateProduct();

  // Protect: only super_admin can create products
  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to create products.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/products')}
        className="mb-2 -ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Fill in the details below to create a new product</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm form={form as UseFormReturn<CreateProductFormValues | UpdateProductFormValues>} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
