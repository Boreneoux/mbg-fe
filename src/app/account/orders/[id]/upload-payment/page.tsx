'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { uploadPaymentProofApi } from '@/features/orders/api/upload-payment-proof.api';
import { useToast } from '@/hooks/use-toast';
import useAuthStore from '@/stores/useAuthStore';

type Props = {
  params: {
    id: string;
  };
};

export default function UploadPaymentPage({ params }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProof(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in before uploading payment proof.',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }

    if (!proof) {
      toast({
        title: 'No file selected',
        description: 'Please choose an image of your payment receipt.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadPaymentProofApi(params.id, proof);
      toast({
        title: 'Upload successful',
        description: 'Payment proof has been submitted successfully.',
      });
      router.push(`/account/orders/${params.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Upload failed',
        description: 'Unable to upload payment proof. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload Payment Proof</h1>

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
              <Button type="submit" disabled={isSubmitting}>
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
    </div>
  );
}
