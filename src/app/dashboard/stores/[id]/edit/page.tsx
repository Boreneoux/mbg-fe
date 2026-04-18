'use client';

import { use } from 'react';
import { useStore } from '@/features/stores/hooks/useStore';
import { StoreForm } from '@/features/stores/components/StoreForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditStorePage({ params }: Props) {
  const { id } = use(params);
  const storeId = Number(id);
  const { store, isLoading, error } = useStore(storeId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-muted-foreground">
        {error ?? 'Store not found.'}
      </div>
    );
  }

  return <StoreForm store={store} />;
}
