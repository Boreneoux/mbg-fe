'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBasket } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/features/categories/hooks/useCategories';

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-3.5 w-16" />
    </div>
  );
}

export default function CategoriesSection() {
  const { categories, isLoading } = useCategories();

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary mb-1">
            Mau belanja apa hari ini?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">Kategori</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : categories.map(category => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-border">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-border bg-gray-50 group-hover:ring-primary/40 group-hover:shadow-sm transition-all duration-200">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBasket className="w-7 h-7 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
                    {category.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
