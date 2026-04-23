'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/features/categories/hooks/useCategories';

const TILE_COLORS = [
  { from: 'from-green-100', to: 'to-emerald-50', text: 'text-green-700' },
  { from: 'from-blue-100', to: 'to-sky-50', text: 'text-blue-700' },
  { from: 'from-red-100', to: 'to-rose-50', text: 'text-red-700' },
  { from: 'from-amber-100', to: 'to-yellow-50', text: 'text-amber-700' },
  { from: 'from-orange-100', to: 'to-amber-50', text: 'text-orange-700' },
  { from: 'from-purple-100', to: 'to-violet-50', text: 'text-purple-700' },
];

function CategorySkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-border bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="px-3 py-3 flex justify-center">
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export default function CategoriesSection() {
  const { categories, isLoading } = useCategories();

  return (
    <section className="py-14 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary mb-1">What are you shopping for today?</p>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Kategori</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/products">See All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((category, i) => {
                const color = TILE_COLORS[i % TILE_COLORS.length];
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-white hover:shadow-lg hover:border-transparent hover:-translate-y-1 transition-all duration-300">
                    <div
                      className={`bg-linear-to-br ${color.from} ${color.to} flex items-center justify-center aspect-square overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBasket className={`w-10 h-10 ${color.text} opacity-60`} />
                      )}
                    </div>
                    <div className="px-3 py-3 text-center">
                      <span className={`text-xs sm:text-sm font-semibold ${color.text}`}>
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
