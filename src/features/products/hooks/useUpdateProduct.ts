'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateProductSchema, UpdateProductFormValues } from '@/features/products/schemas/product.schema';
import { updateProductApi } from '@/features/products/api/updateProduct.api';
import { Product } from '@/features/products/types';

type ApiErr = { data?: { message?: string } };

export function useUpdateProduct(product: Product | null, onSuccess?: () => void) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0,
      weight: product?.weight ?? 0,
      category_id: product?.category_id ?? '',
      photos: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!product?.id) return;
    
    setIsSubmitting(true);
    try {
      await updateProductApi(product.slug, values);
      toast.success('Product updated successfully');
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/products/${product.slug}`);
      }
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to update product';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
