'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VoucherForm } from './VoucherForm';
import { useCreateVoucher } from '../hooks/useCreateVoucher';

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateVoucherDialog({ open, onOpenChange, onSuccess }: CreateVoucherDialogProps) {
  const { form, onSubmit, isSubmitting } = useCreateVoucher(() => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
        </DialogHeader>
        <VoucherForm
          form={form as any}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
