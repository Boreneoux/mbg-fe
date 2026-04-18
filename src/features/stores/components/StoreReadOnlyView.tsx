'use client';

import { MapPin, Ruler, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Store } from '@/features/stores/types';
import useAuthStore from '@/stores/useAuthStore';

type Props = {
  stores: Store[];
  isLoading: boolean;
};

function StoreCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function StoreReadOnlyView({ stores, isLoading }: Props) {
  const user = useAuthStore((s) => s.user);
  const myUserId = user?.id;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your assigned store locations.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your assigned store locations.</p>
      </div>

      {stores.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          No stores available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => {
            const activeAdmins = (store.store_admins ?? []).filter((sa) => !sa.deleted_at);
            const isMyStore = activeAdmins.some((sa) => sa.user_id === myUserId);

            return (
              <Card
                key={store.id}
                className={[
                  'transition-shadow hover:shadow-md',
                  isMyStore ? 'ring-2 ring-primary' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{store.name}</CardTitle>
                    {isMyStore && (
                      <Badge className="shrink-0 gap-1 text-xs">
                        <Star className="h-3 w-3" />
                        My Store
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground font-medium line-clamp-2">{store.address}</p>
                      <p className="text-xs mt-0.5">
                        {store.district.name}, {store.city.name}
                      </p>
                      <p className="text-xs">{store.province.name}</p>
                    </div>
                  </div>

                  {/* Max delivery */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler className="h-4 w-4 shrink-0" />
                    <span>Max delivery: {store.max_delivery_distance} km</span>
                  </div>

                  {activeAdmins.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {activeAdmins.map((sa) => {
                            const name =
                              sa.user.first_name && sa.user.last_name
                                ? `${sa.user.first_name} ${sa.user.last_name}`
                                : sa.user.first_name ?? sa.user.email;
                            return (
                              <Badge key={sa.id} variant="secondary" className="text-xs font-normal">
                                {name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
