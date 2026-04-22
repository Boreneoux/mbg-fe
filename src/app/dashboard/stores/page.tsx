'use client';

import useAuthStore from '@/stores/useAuthStore';
import { useStores } from '@/features/stores/hooks/useStores';
import { StoreTable } from '@/features/stores/components/StoreTable';
import { StoreReadOnlyView } from '@/features/stores/components/StoreReadOnlyView';

export default function StoresPage() {
  const user = useAuthStore((s) => s.user);
  const { stores, isLoading, refetch, pagination, page, setPage, search, setSearch } = useStores();

  if (user?.role === 'super_admin') {
    return (
      <StoreTable
        stores={stores}
        isLoading={isLoading}
        onRefetch={refetch}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
      />
    );
  }

  return <StoreReadOnlyView stores={stores} isLoading={isLoading} />;
}
