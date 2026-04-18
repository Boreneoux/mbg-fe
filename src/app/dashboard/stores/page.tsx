'use client';

import useAuthStore from '@/stores/useAuthStore';
import { useStores } from '@/features/stores/hooks/useStores';
import { StoreTable } from '@/features/stores/components/StoreTable';
import { StoreReadOnlyView } from '@/features/stores/components/StoreReadOnlyView';

export default function StoresPage() {
  const user = useAuthStore((s) => s.user);
  const { stores, isLoading, refetch } = useStores();

  if (user?.role === 'super_admin') {
    return <StoreTable stores={stores} isLoading={isLoading} onRefetch={refetch} />;
  }

  return <StoreReadOnlyView stores={stores} isLoading={isLoading} />;
}
