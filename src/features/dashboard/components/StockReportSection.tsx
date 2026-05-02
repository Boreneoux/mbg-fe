'use client';

import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DatePickerSingle } from '@/components/ui/date-picker-single';
import ReportPagination from '@/features/dashboard/components/ReportPagination';
import { Category } from '@/features/categories/types';
import { useStockReport } from '@/features/dashboard/useStockReport';
import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';
import { UserRole } from '@/features/auth/types';

type StockReportSectionProps = {
  role: UserRole;
  stores: Store[];
  categories: Category[];
  products: Product[];
  isLoadingOptions: boolean;
};

function TableSkeleton({ rows, columns }: { rows: number; columns: number }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell key={columnIndex}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function getTypeBadgeVariant(type: string) {
  if (type === 'addition' || type === 'mutation_in' || type === 'order_cancellation_return') {
    return 'default';
  }

  return 'secondary';
}

export default function StockReportSection({
  role,
  stores,
  categories,
  products,
  isLoadingOptions,
}: StockReportSectionProps) {
  const {
    form,
    monthlyItems,
    historyItems,
    monthlyMeta,
    historyMeta,
    isLoading,
    error,
    handleApplyFilters,
    handleResetFilters,
    setMonthlyPage,
    setHistoryPage,
  } = useStockReport();

  const selectedCategoryId = form.watch('categoryId');
  const selectedProductId = form.watch('productId');
  const filteredProducts = products.filter((product) => {
    if (selectedCategoryId === 'all') {
      return true;
    }

    return String(product.category_id) === selectedCategoryId;
  });

  useEffect(() => {
    if (selectedProductId === 'all') {
      return;
    }

    const productStillAvailable = filteredProducts.some(
      (product) => String(product.id) === selectedProductId
    );

    if (!productStillAvailable) {
      form.setValue('productId', 'all');
    }
  }, [filteredProducts, form, selectedProductId]);

  const totalIn = monthlyItems.reduce((total, item) => total + item.total_in, 0);
  const totalOut = monthlyItems.reduce((total, item) => total + item.total_out, 0);
  const netChange = monthlyItems.reduce((total, item) => total + item.net_change, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Stock Report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review monthly stock movement and per-product journal details with store-scoped access and pagination on every table.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleApplyFilters} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                {role === 'super_admin' && (
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingOptions}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All stores" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Stores</SelectItem>
                            {stores.map((store) => (
                              <SelectItem key={store.id} value={String(store.id)}>
                                {store.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingOptions}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingOptions}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All products" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          {filteredProducts.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journal Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All journal types" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="addition">Addition</SelectItem>
                          <SelectItem value="reduction">Reduction</SelectItem>
                          <SelectItem value="mutation_in">Mutation In</SelectItem>
                          <SelectItem value="mutation_out">Mutation Out</SelectItem>
                          <SelectItem value="order_deduction">Order Deduction</SelectItem>
                          <SelectItem value="order_cancellation_return">Order Cancellation Return</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePickerSingle
                          value={field.value}
                          onChange={(val) => field.onChange(val || '')}
                          disabled={isLoadingOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePickerSingle
                          value={field.value}
                          onChange={(val) => field.onChange(val || '')}
                          disabled={isLoadingOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Detail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Search by product, category, or note"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <Button type="submit" disabled={isLoading}>
                    Apply Filters
                  </Button>
                  <Button type="button" variant="outline" onClick={handleResetFilters} disabled={isLoading}>
                    Reset
                  </Button>
                </div>
              </div>

              {role === 'store_admin' && (
                <Badge variant="secondary" className="w-fit">
                  Scoped to your assigned store
                </Badge>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stock In</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : totalIn.toLocaleString('id-ID')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stock Out</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : totalOut.toLocaleString('id-ID')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Net Change</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : netChange.toLocaleString('id-ID')}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Monthly Stock Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly in, out, and net movement totals with pagination.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Total In</TableHead>
                  <TableHead>Total Out</TableHead>
                  <TableHead>Net Change</TableHead>
                  <TableHead>Entries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={5} columns={5} />
                ) : monthlyItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No monthly stock summary found.
                    </TableCell>
                  </TableRow>
                ) : (
                  monthlyItems.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell>{item.total_in.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.total_out.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.net_change.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.total_entries.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ReportPagination meta={monthlyMeta} onPageChange={setMonthlyPage} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Per-Product Stock Detail</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed stock journal entries by product, category, type, and store.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={5} columns={7} />
                ) : historyItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      No stock detail entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>{item.store_name}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(item.type)} className="capitalize">
                          {item.type.replaceAll('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.quantity.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="max-w-64 whitespace-normal text-muted-foreground">
                        {item.description || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ReportPagination meta={historyMeta} onPageChange={setHistoryPage} />
        </CardContent>
      </Card>
    </div>
  );
}
