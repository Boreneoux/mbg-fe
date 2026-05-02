'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DiscountForm } from './DiscountForm';
import { useCreateDiscount } from '../hooks/useCreateDiscount';

interface CreateDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDiscountDialog({ open, onOpenChange, onSuccess }: CreateDiscountDialogProps) {
  const { form, onSubmit, isSubmitting } = useCreateDiscount(() => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
        </DialogHeader>
        <DiscountForm
          form={form as any}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
