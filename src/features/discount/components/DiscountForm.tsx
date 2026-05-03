'use client';

import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerSingle } from '@/components/ui/date-picker-single';
import { ProductCombobox } from '@/components/ui/product-combobox';
import { useStores } from '@/features/stores/hooks/useStores';
import { useProducts } from '@/features/products/hooks/useProducts';
import useAuthStore from '@/stores/useAuthStore';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from '@/components/ui/input-group';
import type { CreateDiscountFormValues } from '@/features/discount/schemas/discount.schema';

interface DiscountFormProps {
  form: UseFormReturn<CreateDiscountFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function DiscountForm({ form, onSubmit, isSubmitting, onCancel }: DiscountFormProps) {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'super_admin';
  const { stores } = useStores();
  const { products } = useProducts({ limit: 9999 });

  const type = form.watch('type');
  const productId = form.watch('product_id');
  const productOptions = [
    { value: '', label: 'Store-wide (No specific product)' },
    ...products.map((product) => ({
      value: String(product.id),
      label: product.name,
    })),
  ];

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Store Selection (Only for Super Admin) */}
        {isSuperAdmin && (
          <FormField
            control={form.control}
            name="store_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Store</FormLabel>
                <Select
                  onValueChange={(val) => {
                    if (val === 'all') return field.onChange('all');
                    field.onChange(val || null);
                  }}
                  value={field.value?.toString() ?? ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store or all stores" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Stores (Global)</SelectItem>
                    {stores?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Product Selection */}
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Product (Optional)</FormLabel>
              <FormControl>
                <ProductCombobox
                  options={productOptions}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => {
                    field.onChange(value || null);
                  }}
                  placeholder="No specific product (Store-wide)"
                  searchPlaceholder="Search products..."
                  emptyMessage="No product found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nominal">Nominal Amount</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="buy_one_get_one">Buy 1 Get 1 Free</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Value (Not needed for BOGO) */}
        {type !== 'buy_one_get_one' && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value {type === 'percentage' ? '(%)' : '(IDR)'}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Minimum Purchase (Not needed for BOGO or specific product) */}
        {type !== 'buy_one_get_one' && !productId && (
          <FormField
            control={form.control}
            name="min_purchase_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase Amount (Optional)</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>Rp</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Max Discount (Only useful for percentage) */}
        {type === 'percentage' && (
          <FormField
            control={form.control}
            name="max_discount_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount Value (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Started At */}
        <FormField
          control={form.control}
          name="started_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
              <FormControl>
                <DatePickerSingle
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val ?? null)}
                  placeholder="Pick start date"
                  optional
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expired At */}
        <FormField
          control={form.control}
          name="expired_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
              <FormControl>
                <DatePickerSingle
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val ?? null)}
                  placeholder="Pick expiry date"
                  optional
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Discount'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
