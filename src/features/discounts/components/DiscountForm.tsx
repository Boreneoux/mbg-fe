'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { CreateDiscountFormValues } from '../schemas/discount.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerSingle } from '@/components/ui/date-picker-single';
import { useStores } from '@/features/stores/hooks/useStores';
import { useProducts } from '@/features/products/hooks/useProducts';
import useAuthStore from '@/stores/useAuthStore';

interface DiscountFormProps {
  form: ReturnType<typeof useFormContext>;
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function DiscountForm({ form, onSubmit, isSubmitting, onCancel }: DiscountFormProps) {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'super_admin';
  const { stores } = useStores();
  const { products } = useProducts({ limit: 100 });

  const type = form.watch('type');

  return (
    <Form {...(form as any)}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Store Selection (Only for Super Admin) */}
        {isSuperAdmin && (
          <FormField
            control={form.control as any}
            name="store_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Store</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === 'all' ? 'all' : Number(val))}
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
          control={form.control as any}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Product (Optional)</FormLabel>
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
                  <SelectItem value="none">No specific product (Store-wide)</SelectItem>
                  {products?.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Type */}
        <FormField
          control={form.control as any}
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
            control={form.control as any}
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
        {type === 'percentage' && (
          <FormField
            control={form.control as any}
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
          control={form.control as any}
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
          control={form.control as any}
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
