'use client';

import { use, useState, useEffect } from 'react';
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

  const [primaryIndex, setPrimaryIndex] = useState<number | null>(null);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  // Set initial primary index when product loads
  useEffect(() => {
    if (product?.product_images) {
      const primaryIdx = product.product_images.findIndex(img => img.is_primary);
      setPrimaryIndex(primaryIdx >= 0 ? primaryIdx : null);
    }
  }, [product]);

  // Protect: only super_admin can edit products
  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You do not have permission to edit products.</p>
      </div>
    );
  }

  const handlePrimaryChange = (index: number | null) => {
    setPrimaryIndex(index);
    form.setValue('primaryIndex', index ?? undefined);
  };

  const handleDeleteExisting = (imageId: number) => {
    const imageIndex = product?.product_images.findIndex(img => img.id === imageId) ?? -1;
    setDeleteImageIds(prev => [...prev, imageId]);
    form.setValue('deleteImageIds', [...deleteImageIds, imageId]);
    
    // Adjust primary index if necessary
    if (primaryIndex !== null && imageIndex >= 0 && imageIndex < primaryIndex) {
      const newPrimaryIndex = primaryIndex - 1;
      setPrimaryIndex(newPrimaryIndex >= 0 ? newPrimaryIndex : null);
      form.setValue('primaryIndex', newPrimaryIndex >= 0 ? newPrimaryIndex : undefined);
    } else if (primaryIndex === imageIndex) {
      setPrimaryIndex(null);
      form.setValue('primaryIndex', undefined);
    }
  };

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
            onPrimaryChange={handlePrimaryChange}
            onDeleteExisting={handleDeleteExisting}
            primaryIndex={primaryIndex}
            deleteImageIds={deleteImageIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
