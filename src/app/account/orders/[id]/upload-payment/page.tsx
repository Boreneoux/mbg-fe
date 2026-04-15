'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { OrderNotFound, PaymentDeadlineWarning, OrderLoadingSkeleton } from '@/features/orders/components';
import { usePaymentDeadline, useUploadPaymentProof } from '@/features/orders/hooks';
import useAuthStore from '@/stores/useAuthStore';

type Props = {
  params: {
    id: string;
  };
};

export default function UploadPaymentPage({ params }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [proof, setProof] = useState<File | null>(null);

  const { order, isLoadingOrder, isSubmitting, handleUpload } = useUploadPaymentProof(
    params.id,
    () => toast.success('Payment proof uploaded successfully'),
    (message) => toast.error(message)
  );

  const deadline = usePaymentDeadline(order?.payment_deadline);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProof(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error('Please sign in before uploading payment proof.');
      router.push('/auth/login');
      return;
    }

    if (!proof) {
      toast.error('Please select an image file.');
      return;
    }

    await handleUpload(proof);
  };

  // Handle payment deadline expiry
  useEffect(() => {
    if (deadline.isExpired) {
      toast.error('Payment deadline expired. Your order has been automatically cancelled.');
      const timer = setTimeout(() => {
        router.push('/account/orders');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deadline.isExpired, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload Payment Proof</h1>

      {isLoadingOrder ? (
        <OrderLoadingSkeleton />
      ) : !order ? (
        <OrderNotFound onBack={() => router.push('/account/orders')} />
      ) : (
        <>
          {/* Payment Deadline Warning */}
          <div className="mb-6">
            <PaymentDeadlineWarning deadline={deadline} />
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Upload a photo or screenshot of your payment receipt. The file must be an image (JPG, PNG, GIF) and should clearly show the transfer details.
              </p>
              <Separator />
            </div>

            {!user ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You must be signed in to upload payment proof.</p>
                <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="payment-proof">Payment proof image</Label>
                  <Input
                    id="payment-proof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {proof && (
                    <p className="text-sm text-muted-foreground">Selected file: {proof.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" disabled={isSubmitting || deadline.isExpired}>
                    {isSubmitting ? 'Uploading...' : 'Upload Payment Proof'}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push(`/account/orders/${params.id}`)}
                  >
                    Back to Order
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
