import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function OrderLoadingSkeleton() {
  return (
    <Card className="p-6 space-y-6">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-12 w-full" />
    </Card>
  );
}
