'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useProduct } from '@/features/products/hooks/useProduct';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog';
import { Edit, Trash2, ChevronLeft } from 'lucide-react';
import { formatCurrencyIDR } from '@/utils/currency';
import { useState } from 'react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { product, isLoading, error } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto">
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

  const isEditor = user?.role === 'super_admin';

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-1">{product.category.name}</p>
          </div>
          {isEditor && (
            <div className="flex gap-2">
              <Link href={`/dashboard/products/${product.slug}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Photos Gallery */}
            {product.product_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.product_images.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={image.image_url}
                          alt="Product photo"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing & Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrencyIDR(Number(product.price))}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-lg font-semibold">
                    {product.weight} kg
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{product.category.name}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    ID: {product.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isEditor && (
        <DeleteProductDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          productId={product.id}
          productName={product.name}
          onSuccess={() => router.push('/dashboard/products')}
        />
      )}
    </>
  );
}
