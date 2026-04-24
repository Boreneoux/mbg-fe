'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDiscount } from '@/features/discount/hooks/useCreateDiscount';
import { useDiscounts } from '@/features/discount/hooks/useDiscounts';
import { useGetStores } from '@/features/user-management/hooks/useGetStores';
import { useProducts } from '@/features/products/hooks/useProducts';

export default function DiscountsPage() {
  const { stores, isLoading: isStoresLoading } = useGetStores();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { discounts, isLoading: isDiscountsLoading, refetch } = useDiscounts({ limit: 25 });

  const directCreate = useCreateDiscount(refetch, {
    type: 'nominal',
  });
  const minSpendCreate = useCreateDiscount(refetch, {
    type: 'percentage',
  });
  const bogoCreate = useCreateDiscount(refetch, {
    type: 'buy_one_get_one',
  });

  const storeOptions = useMemo(
    () => stores.map((store) => ({ label: store.name, value: store.id })),
    [stores]
  );

  const productOptions = useMemo(
    () => products.map((product) => ({ label: product.name, value: product.id })),
    [products]
  );

  const formatCurrency = (value?: number | null) =>
    value === null || value === undefined
      ? '-'
      : new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(value);

  const formatDiscountType = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Percentage';
      case 'nominal':
        return 'Nominal';
      case 'buy_one_get_one':
        return 'Buy 1 Get 1';
      default:
        return type;
    }
  };

  const renderDiscountValue = (discount: any) => {
    if (discount.type === 'buy_one_get_one') {
      return 'BOGO';
    }

    return discount.value != null ? formatCurrency(discount.value) : '-';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-gray-600 mt-1">Create programmatic store discounts, min-spend offers, and buy-one-get-one deals.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Product Discount</CardTitle>
              <CardDescription>Apply a percentage or nominal discount to a specific product.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...directCreate.form}>
                <form onSubmit={directCreate.onSubmit} className="space-y-4">
                  <FormField
                    control={directCreate.form.control}
                    name="store_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isStoresLoading ? 'Loading stores…' : 'Select store'} />
                            </SelectTrigger>
                            <SelectContent>
                              {storeOptions.map((store) => (
                                <SelectItem key={store.value} value={String(store.value)}>
                                  {store.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={directCreate.form.control}
                    name="product_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isProductsLoading ? 'Loading products…' : 'Select product'} />
                            </SelectTrigger>
                            <SelectContent>
                              {productOptions.map((product) => (
                                <SelectItem key={product.value} value={String(product.value)}>
                                  {product.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={directCreate.form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount type</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="nominal">Nominal</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={directCreate.form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              step={0.01}
                              value={field.value ?? ''}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === '' ? null : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={directCreate.form.control}
                    name="expired_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={field.value ?? ''}
                            onChange={(event) => field.onChange(event.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={directCreate.isSubmitting}>
                      {directCreate.isSubmitting ? 'Saving…' : 'Create discount'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Minimum Spend Discount</CardTitle>
              <CardDescription>Trigger a discount after customers reach a minimum subtotal.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...minSpendCreate.form}>
                <form onSubmit={minSpendCreate.onSubmit} className="space-y-4">
                  <FormField
                    control={minSpendCreate.form.control}
                    name="store_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isStoresLoading ? 'Loading stores…' : 'Select store'} />
                            </SelectTrigger>
                            <SelectContent>
                              {storeOptions.map((store) => (
                                <SelectItem key={store.value} value={String(store.value)}>
                                  {store.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={minSpendCreate.form.control}
                      name="min_purchase_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum spend</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              step={0.01}
                              value={field.value ?? ''}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === '' ? null : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={minSpendCreate.form.control}
                      name="max_discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              step={0.01}
                              value={field.value ?? ''}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === '' ? null : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={minSpendCreate.form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount type</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="nominal">Nominal</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={minSpendCreate.form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              step={0.01}
                              value={field.value ?? ''}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === '' ? null : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={minSpendCreate.form.control}
                    name="expired_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={field.value ?? ''}
                            onChange={(event) => field.onChange(event.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={minSpendCreate.isSubmitting}>
                      {minSpendCreate.isSubmitting ? 'Saving…' : 'Create min spend'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buy One Get One</CardTitle>
              <CardDescription>Give customers a free item after they purchase one of the selected products.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...bogoCreate.form}>
                <form onSubmit={bogoCreate.onSubmit} className="space-y-4">
                  <FormField
                    control={bogoCreate.form.control}
                    name="store_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isStoresLoading ? 'Loading stores…' : 'Select store'} />
                            </SelectTrigger>
                            <SelectContent>
                              {storeOptions.map((store) => (
                                <SelectItem key={store.value} value={String(store.value)}>
                                  {store.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bogoCreate.form.control}
                    name="product_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isProductsLoading ? 'Loading products…' : 'Select product'} />
                            </SelectTrigger>
                            <SelectContent>
                              {productOptions.map((product) => (
                                <SelectItem key={product.value} value={String(product.value)}>
                                  {product.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bogoCreate.form.control}
                    name="expired_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={field.value ?? ''}
                            onChange={(event) => field.onChange(event.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={bogoCreate.isSubmitting}>
                      {bogoCreate.isSubmitting ? 'Saving…' : 'Create BOGO'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Discounts</CardTitle>
            <CardDescription>Review available discount conditions and expiry details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isDiscountsLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((id) => (
                  <div key={id} className="h-24 rounded-xl bg-muted p-4" />
                ))}
              </div>
            ) : discounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No discounts yet. Create a discount to see it appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {discounts.map((discount) => (
                  <div key={discount.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{formatDiscountType(discount.type)}</p>
                        <p className="text-sm text-muted-foreground">
                          Store #{discount.store_id}
                          {discount.product?.name ? ` · ${discount.product.name}` : ''}
                        </p>
                      </div>
                      <Badge variant="secondary">{renderDiscountValue(discount)}</Badge>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl bg-muted p-3 text-sm">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Minimum spend</p>
                        <p>{formatCurrency(discount.min_purchase_amount)}</p>
                      </div>
                      <div className="rounded-xl bg-muted p-3 text-sm">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Expires</p>
                        <p>{discount.expired_at ? new Date(discount.expired_at).toLocaleDateString() : 'No expiry'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
