import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function CartItemSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-5 w-1/3 mb-3" />
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="flex gap-1">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-10 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
