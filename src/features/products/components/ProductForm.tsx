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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductPhotoUpload } from './ProductPhotoUpload';
import { CreateProductFormValues, UpdateProductFormValues } from '@/features/products/schemas/product.schema';
import { ProductCategory, Product } from '@/features/products/types';
import { useCategories } from '@/features/products/hooks/useCategories';
import { formatPriceNumber } from '@/utils/currency';

interface ProductFormProps {
  form: UseFormReturn<CreateProductFormValues | UpdateProductFormValues>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isLoading?: boolean;
  product?: Product | null;
  submitLabel?: string;
  onPrimaryChange?: (primaryIndex: number | null) => void;
  onDeleteExisting?: (imageId: number) => void;
  primaryIndex?: number | null;
  deleteImageIds?: number[];
}

export function ProductForm({
  form,
  onSubmit,
  isSubmitting,
  isLoading = false,
  product,
  submitLabel = product ? 'Update Product' : 'Create Product',
  onPrimaryChange,
  onDeleteExisting,
  primaryIndex,
  deleteImageIds = [],
}: ProductFormProps) {
  const { categories } = useCategories();

  // Pre-populate form when product changes (for edit mode)
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description ?? '',
        price: Number(product.price),
        weight: Number(product.weight),
        category_id: product.category_id,
        photos: [],
      });
    }
  }, [product, form]);

  const isReadOnly = isLoading || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product name"
                  disabled={isReadOnly}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  disabled={isReadOnly}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? field.value.toString() : ''}
                disabled={isReadOnly}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: ProductCategory) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price & Weight Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (IDR)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0"
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      if (rawValue === '' || !isNaN(Number(rawValue))) {
                        field.onChange(rawValue === '' ? 0 : Number(rawValue));
                      }
                    }}
                    value={field.value ? field.value.toLocaleString('en-US') : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={isReadOnly}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Photos */}
        <div>
          <FormLabel className="block mb-3">Product Photos</FormLabel>
          <ProductPhotoUpload
            onFilesChange={(files) => {
              form.setValue('photos', files);
            }}
            onPrimaryChange={onPrimaryChange}
            onDeleteExisting={onDeleteExisting}
            existingPhotos={product?.product_images.filter(img => !deleteImageIds.includes(img.id)) ?? []}
            isDisabled={isReadOnly}
            primaryIndex={primaryIndex}
          />
          {form.formState.errors.photos && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.photos.message}</p>
          )}
        </div>

        {/* Form Level Error */}
        {form.formState.errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full"
        >
          {isSubmitting ? 'Loading...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
