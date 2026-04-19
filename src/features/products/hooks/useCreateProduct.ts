'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProductSchema, CreateProductFormValues } from '@/features/products/schemas/product.schema';
import { createProductApi } from '@/features/products/api/createProduct.api';

type ApiErr = { data?: { message?: string } };

export function useCreateProduct(onSuccess?: () => void) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      weight: 0,
      category_id: 0,
      photos: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const product = await createProductApi(values);
      toast.success('Product created successfully');
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/products/${product.id}`);
      }
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to create product';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
