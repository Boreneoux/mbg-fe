'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { createCategorySchema, updateCategorySchema, CreateCategoryFormValues, UpdateCategoryFormValues } from '../schemas/category.schema';
import { createCategoryApi } from '../api/createCategory.api';
import { updateCategoryApi } from '../api/updateCategory.api';
import { Category } from '../types';
import { getCategoriesApi } from '../api/getCategories.api';

type CategoryFormValues = CreateCategoryFormValues | UpdateCategoryFormValues;

export function useFormCategory(mode: 'create' | 'edit' = 'create', initialData?: Category) {
  const router = useRouter();
  const schema = mode === 'create' ? createCategorySchema : updateCategorySchema;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? '',
      photo: undefined,
    },
  });

  // Check if category name already exists
  const checkDuplicateName = async (name: string): Promise<boolean> => {
    try {
      const { data: categories } = await getCategoriesApi();
      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== initialData?.id
      );
      return exists;
    } catch {
      return false;
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    // Check for duplicate name
    if (values.name) {
      const isDuplicate = await checkDuplicateName(values.name);
      if (isDuplicate) {
        form.setError('name', { message: 'A category with this name already exists' });
        return;
      }
    }

    const payload = {
      name: values.name as string,
      photo: (values as CreateCategoryFormValues).photo,
    };

    try {
      if (mode === 'create') {
        await createCategoryApi(payload);
        toast.success('Category created successfully');
        router.push('/dashboard/categories');
      } else if (mode === 'edit' && initialData) {
        const updatePayload = {
          name: values.name,
          photo: (values as UpdateCategoryFormValues).photo,
        };
        await updateCategoryApi(initialData.slug, updatePayload);
        toast.success('Category updated successfully');
        router.push(`/dashboard/categories/${initialData.slug}`);
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? `Failed to ${mode} category`)
        : 'An unexpected error occurred';
      form.setError('root', { message });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isSubmitting: form.formState.isSubmitting };
}
