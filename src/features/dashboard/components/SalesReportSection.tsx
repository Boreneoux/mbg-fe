'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DatePickerSingle } from '@/components/ui/date-picker-single';
import { Category } from '@/features/categories/types';
import MonthlyBarChart from '@/features/dashboard/components/MonthlyBarChart';
import ReportPagination from '@/features/dashboard/components/ReportPagination';
import { useSalesReport } from '@/features/dashboard/useSalesReport';
import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';
import { UserRole } from '@/features/auth/types';
import { formatCurrencyIDR } from '@/utils/currency';

type SalesReportSectionProps = {
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

export default function SalesReportSection({
  role,
  stores,
  categories,
  products,
  isLoadingOptions,
}: SalesReportSectionProps) {
  const {
    form,
    monthlyItems,
    categoryItems,
    productItems,
    categoryMeta,
    productMeta,
    isLoading,
    error,
    handleApplyFilters,
    handleResetFilters,
    setCategoryPage,
    setProductPage,
  } = useSalesReport();

  const selectedCategoryId = form.watch('categoryId');
  const filteredProducts = products.filter((product) => {
    if (selectedCategoryId === 'all') {
      return true;
    }

    return product.category_id === selectedCategoryId;
  });

  const totalSales = monthlyItems.reduce((total, item) => total + item.total_sales, 0);
  const totalOrders = monthlyItems.reduce((total, item) => total + item.total_orders, 0);
  const totalItems = monthlyItems.reduce((total, item) => total + item.total_items, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Sales Report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly sales trend plus category and product breakdowns. Category and product filters apply to the detail tables, while the monthly chart follows the store and date scope supported by the API.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleApplyFilters} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={isLoading}>
                    Apply Filters
                  </Button>
                  <Button type="button" variant="outline" onClick={handleResetFilters} disabled={isLoading}>
                    Reset
                  </Button>
                </div>
                {role === 'store_admin' && (
                  <Badge variant="secondary" className="w-fit">
                    Scoped to your assigned store
                  </Badge>
                )}
              </div>
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
            <CardTitle className="text-base">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrencyIDR(totalSales)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : totalOrders.toLocaleString('id-ID')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items Sold</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : totalItems.toLocaleString('id-ID')}
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
      ) : (
        <MonthlyBarChart
          title="Monthly Sales Chart"
          description="Revenue by month for the selected store and date range."
          emptyMessage="No monthly sales data found for the selected filters."
          items={monthlyItems.map((item) => ({
            label: item.month,
            value: item.total_sales,
            secondaryValue: formatCurrencyIDR(item.total_sales),
          }))}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Sales by Category</CardTitle>
            <p className="text-sm text-muted-foreground">Paginated category contribution across the selected period.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton rows={5} columns={4} />
                  ) : categoryItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No category sales data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoryItems.map((item) => (
                      <TableRow key={item.category_id}>
                        <TableCell className="font-medium">{item.category_name}</TableCell>
                        <TableCell>{formatCurrencyIDR(item.total_sales)}</TableCell>
                        <TableCell>{item.total_quantity.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{item.total_orders.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <ReportPagination meta={categoryMeta} onPageChange={setCategoryPage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Sales by Product</CardTitle>
            <p className="text-sm text-muted-foreground">Top product performance with product-specific filtering and pagination.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton rows={5} columns={5} />
                  ) : productItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No product sales data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    productItems.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell>{item.category_name}</TableCell>
                        <TableCell>{formatCurrencyIDR(item.total_sales)}</TableCell>
                        <TableCell>{item.total_quantity.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{item.total_orders.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <ReportPagination meta={productMeta} onPageChange={setProductPage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
