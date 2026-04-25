'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/features/products/hooks/useProducts';

interface VoucherFormProps {
  form: ReturnType<typeof useFormContext>;
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function VoucherForm({ form, onSubmit, isSubmitting, onCancel }: VoucherFormProps) {
  const { products } = useProducts({ limit: 100 });

  const usageType = form.watch('usage_type');
  const discountType = form.watch('discount_type');

  return (
    <Form {...(form as any)}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Code */}
        <FormField
          control={form.control as any}
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
          control={form.control as any}
          name="usage_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
            control={form.control as any}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Product</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                  value={field.value?.toString() ?? 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" disabled>Select a product</SelectItem>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Discount Type */}
        <FormField
          control={form.control as any}
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
          control={form.control as any}
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
        <FormField
          control={form.control as any}
          name="min_purchase_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase (Optional)</FormLabel>
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

        {/* Max Discount (Only useful for percentage) */}
        {discountType === 'percentage' && (
          <FormField
            control={form.control as any}
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
          control={form.control as any}
          name="expired_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date & Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(date.toISOString());
                  }}
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
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
