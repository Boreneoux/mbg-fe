'use client';

import { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDiscounts } from '@/features/discounts/hooks/useDiscounts';
import { useDeleteDiscount } from '@/features/discounts/hooks/useDeleteDiscount';
import { useUpdateDiscount } from '@/features/discounts/hooks/useUpdateDiscount';
import { DiscountList } from '@/features/discounts/components/DiscountList';
import { CreateDiscountDialog } from '@/features/discounts/components/CreateDiscountDialog';
import { EditDiscountDialog } from '@/features/discounts/components/EditDiscountDialog';
import { Discount } from '@/features/discounts/types';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';

export default function DiscountsPage() {
  const user = useAuthStore((s) => s.user);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  const { discounts, meta, isLoading, refetch, page, setPage, search, setSearch } = useDiscounts();
  const { deleteDiscount, isDeleting } = useDeleteDiscount(refetch);
  const { updateDiscount } = useUpdateDiscount(refetch);

  const handleToggleActive = (id: number, currentStatus: boolean) => {
    updateDiscount(id, { is_active: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-gray-600 mt-1">Manage automatic store and product discounts</p>
        </div>
        {(user?.role === 'super_admin' || user?.role === 'store_admin') && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Discount
          </Button>
        )}
      </div>

      <DiscountList
        discounts={discounts}
        isLoading={isLoading}
        onDelete={(id) => setConfirmDeleteId(id)}
        onEdit={setEditingDiscount}
        onToggleActive={handleToggleActive}
        pagination={meta}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
      />

      {showCreateDialog && (
        <CreateDiscountDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={refetch}
        />
      )}

      {editingDiscount && (
        <EditDiscountDialog
          discount={editingDiscount}
          open={!!editingDiscount}
          onOpenChange={(open) => !open && setEditingDiscount(null)}
          onSuccess={refetch}
        />
      )}

      <ConfirmDeleteDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId !== null) {
            deleteDiscount(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        isDeleting={isDeleting}
        title="Delete Discount"
        description="Are you sure you want to delete this discount? This action cannot be undone."
      />
    </div>
  );
}
