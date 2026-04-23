'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';
import { Product } from '@/features/products/types';
import { formatCurrencyIDR } from '@/utils/currency';

interface ProductReadOnlyViewProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductReadOnlyView({ products, isLoading = false }: ProductReadOnlyViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-gray-500 text-sm">No products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Product Image */}
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            {product.product_images.length > 0 ? (
              <img
                src={product.product_images[0].image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
            {product.product_images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                +{product.product_images.length - 1} more
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {product.description || 'No description'}
            </p>

            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">Price: </span>
                <span className="font-semibold text-lg">{formatCurrencyIDR(product.price)}</span>
              </div>
              <div>
                <span className="text-gray-500">Weight: </span>
                <span className="font-medium">{product.weight} kg</span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Link href={`/dashboard/products/${product.id}`} className="w-full">
              <Button variant="outline" className="w-full" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
