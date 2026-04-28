'use client';

import { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';
import { useDeleteVoucher } from '@/features/vouchers/hooks/useDeleteVoucher';
import { useSetReferralVoucher } from '@/features/vouchers/hooks/useSetReferralVoucher';
import { useSetReferrerRewardVoucher } from '@/features/vouchers/hooks/useSetReferrerRewardVoucher';
import { VoucherList } from '@/features/vouchers/components/VoucherList';
import { CreateVoucherDialog } from '@/features/vouchers/components/CreateVoucherDialog';
import { EditVoucherDialog } from '@/features/vouchers/components/EditVoucherDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Voucher } from '@/features/vouchers/types';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function VouchersPage() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmSetReferralId, setConfirmSetReferralId] = useState<number | null>(null);
  const [confirmSetReferrerRewardId, setConfirmSetReferrerRewardId] = useState<number | null>(null);

  const { vouchers, meta, isLoading, refetch } = useVouchers({ page, limit: 10 });
  const { deleteVoucher, isDeleting } = useDeleteVoucher(refetch);
  const { setReferralVoucher, isSettingReferral } = useSetReferralVoucher(refetch);
  const { setReferrerRewardVoucher, isSettingReferrerReward } = useSetReferrerRewardVoucher(refetch);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vouchers</h1>
          <p className="text-gray-600 mt-1">Manage promotional codes and their constraints</p>
        </div>
        {(user?.role === 'super_admin' || user?.role === 'store_admin') && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Voucher
          </Button>
        )}
      </div>

      <VoucherList
        vouchers={vouchers}
        isLoading={isLoading}
        onDelete={(id) => setConfirmDeleteId(id)}
        onEdit={setEditingVoucher}
        onSetReferral={user?.role === 'super_admin' ? (id) => setConfirmSetReferralId(id) : undefined}
        onSetReferrerReward={user?.role === 'super_admin' ? (id) => setConfirmSetReferrerRewardId(id) : undefined}
      />

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={meta.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(meta.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setPage(i + 1)}
                  isActive={meta.page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                className={meta.page >= meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {showCreateDialog && (
        <CreateVoucherDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={refetch}
        />
      )}

      {editingVoucher && (
        <EditVoucherDialog
          voucher={editingVoucher}
          open={!!editingVoucher}
          onOpenChange={(open) => !open && setEditingVoucher(null)}
          onSuccess={refetch}
        />
      )}

      <ConfirmDeleteDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId !== null) {
            deleteVoucher(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        isDeleting={isDeleting}
        title="Delete Voucher"
        description="Are you sure you want to delete this voucher? This action cannot be undone."
      />

      <AlertDialog open={confirmSetReferrerRewardId !== null} onOpenChange={(open) => !open && setConfirmSetReferrerRewardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set as Referrer Reward Voucher</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current referrer reward. Users whose referral code is used during registration will receive this voucher instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSettingReferrerReward}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSettingReferrerReward}
              onClick={() => {
                if (confirmSetReferrerRewardId !== null) {
                  setReferrerRewardVoucher(confirmSetReferrerRewardId);
                  setConfirmSetReferrerRewardId(null);
                }
              }}
            >
              {isSettingReferrerReward ? 'Saving...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmSetReferralId !== null} onOpenChange={(open) => !open && setConfirmSetReferralId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set as Referral Voucher</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current referral voucher. New users who register with a referral code will receive this voucher instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSettingReferral}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSettingReferral}
              onClick={() => {
                if (confirmSetReferralId !== null) {
                  setReferralVoucher(confirmSetReferralId);
                  setConfirmSetReferralId(null);
                }
              }}
            >
              {isSettingReferral ? 'Saving...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
