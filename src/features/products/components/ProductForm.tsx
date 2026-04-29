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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProductPhotoUpload } from './ProductPhotoUpload';
import {
  CreateProductFormValues,
  UpdateProductFormValues
} from '@/features/products/schemas/product.schema';
import { ProductCategory, Product } from '@/features/products/types';
import { useCategories } from '@/features/products/hooks/useCategories';

interface ProductFormProps {
  form: UseFormReturn<CreateProductFormValues | UpdateProductFormValues>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isLoading?: boolean;
  product?: Product | null;
  submitLabel?: string;
  onPrimaryChange?: (primaryIndex: number | null) => void;
  onDeleteExisting?: (imageId: string) => void;
  primaryIndex?: number | null;
  deleteImageIds?: string[];
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
  deleteImageIds = []
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
        photos: []
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
                onValueChange={value => field.onChange(value)}
                value={field.value || ''}
                disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: ProductCategory) => (
                    <SelectItem key={category.id} value={category.id}>
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
            render={({ field }) => {
              const num = Number(field.value) || 0;
              // Always show live thousands-formatting — the dots get stripped by /\D/g on next change
              const displayValue = num > 0 ? num.toLocaleString('id-ID') : '';

              return (
                <FormItem>
                  <FormLabel>Price (IDR)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                        Rp
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        disabled={isReadOnly}
                        className="pl-9"
                        value={displayValue}
                        onChange={e => {
                          // Strip the dots (Indonesian thousand separator) and any non-digit chars
                          const digits = e.target.value.replace(/\D/g, '');
                          field.onChange(digits === '' ? 0 : Number(digits));
                        }}
                        onBlur={field.onBlur}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                    onChange={e => field.onChange(Number(e.target.value))}
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
            onFilesChange={files => {
              form.setValue('photos', files);
            }}
            onPrimaryChange={onPrimaryChange}
            onDeleteExisting={onDeleteExisting}
            existingPhotos={
              product?.product_images.filter(
                img => !deleteImageIds.includes(img.id)
              ) ?? []
            }
            isDisabled={isReadOnly}
            primaryIndex={primaryIndex}
          />
          {form.formState.errors.photos && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.photos.message}
            </p>
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
          className="w-full">
          {isSubmitting ? 'Loading...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
