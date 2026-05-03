'use client';

import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerSingle } from '@/components/ui/date-picker-single';
import { ProductCombobox } from '@/components/ui/product-combobox';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from '@/components/ui/input-group';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { CreateVoucherFormValues } from '@/features/vouchers/schemas/voucher.schema';

interface VoucherFormProps {
  form: UseFormReturn<CreateVoucherFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function VoucherForm({ form, onSubmit, isSubmitting, onCancel }: VoucherFormProps) {
  const { products } = useProducts({ limit: 9999 });

  const usageType = form.watch('usage_type');
  const discountType = form.watch('discount_type');
  const productOptions = [
    { value: '', label: 'Select a product...' },
    ...products.map((product) => ({
      value: String(product.id),
      label: product.name,
    })),
  ];

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voucher Code</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER2024" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Usage Type */}
        <FormField
          control={form.control}
          name="usage_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Type</FormLabel>
              <Select onValueChange={(val) => {
                field.onChange(val);
                if (val !== 'product_specific') {
                  form.setValue('product_id', null, { shouldValidate: true });
                }
              }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select usage type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="total_purchase">Total Purchase</SelectItem>
                  <SelectItem value="product_specific">Product Specific</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Selection */}
        {usageType === 'product_specific' && (
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Product</FormLabel>
                <FormControl>
                  <ProductCombobox
                    options={productOptions}
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(value || null)}
                    placeholder="Select product"
                    searchPlaceholder="Search products..."
                    emptyMessage="No product found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Discount Type */}
        <FormField
          control={form.control}
          name="discount_type"
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Value */}
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value {discountType === 'percentage' ? '(%)' : '(IDR)'}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Purchase */}
        {usageType !== 'product_specific' && (
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
        {discountType === 'percentage' && (
          <FormField
            control={form.control}
            name="max_discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount Amount (Optional)</FormLabel>
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

        <FormField
          control={form.control}
          name="expired_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <DatePickerSingle
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val ?? null)}
                  placeholder="Pick expiry date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reward Duration */}
        <FormField
          control={form.control}
          name="reward_duration_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid for (days after issued) <span className="text-muted-foreground font-normal">— Optional</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 7"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  value={field.value ?? ''}
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
            {isSubmitting ? 'Saving...' : 'Save Voucher'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
