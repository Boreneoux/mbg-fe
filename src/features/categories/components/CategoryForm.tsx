'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategoryPhotoUpload } from './CategoryPhotoUpload';
import { CreateCategoryFormValues, UpdateCategoryFormValues } from '@/features/categories/schemas/category.schema';
import { Category } from '@/features/categories/types';

interface CategoryFormProps {
  form: UseFormReturn<CreateCategoryFormValues | UpdateCategoryFormValues>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isLoading?: boolean;
  category?: Category | null;
  submitLabel?: string;
  isReadOnly?: boolean;
}

export function CategoryForm({
  form,
  onSubmit,
  isSubmitting,
  isLoading = false,
  category,
  submitLabel,
  isReadOnly = false,
}: CategoryFormProps) {
  const defaultLabel = category ? 'Update Category' : 'Create Category';

  // Pre-populate form when category changes (for edit mode)
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        photo: undefined,
      });
    }
  }, [category, form]);

  const isDisabled = isLoading || isSubmitting || isReadOnly;

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Name</h3>
          <p className="text-base text-gray-900">{category?.name}</p>
        </div>

        {category?.image_url && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Photo</h3>
            <img
              src={category.image_url}
              alt={category.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Root Error */}
        {form.formState.errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Category Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name (e.g., Fruits, Vegetables)"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Upload */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Photo</FormLabel>
              <FormControl>
                <CategoryPhotoUpload
                  onFileChange={(file) => field.onChange(file)}
                  existingPhoto={category?.image_url}
                  isDisabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isDisabled}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : (submitLabel || defaultLabel)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
