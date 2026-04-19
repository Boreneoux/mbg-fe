'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useUpdateProduct } from '@/features/products/hooks/useUpdateProduct';
import { ProductForm } from '@/features/products/components/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const productId = parseInt(id);
  const { product, isLoading, error } = useProduct(productId);
  const { form, onSubmit, isSubmitting } = useUpdateProduct(product || null);

  // Protect: only super_admin can edit products
  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to edit products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
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
            <p className="text-red-500">{error || 'Product not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-2"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Go Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product details and photos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Modify the product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            product={product}
            submitLabel="Update Product"
          />
        </CardContent>
      </Card>
    </div>
  );
}
