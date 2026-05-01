'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createDefaultSalesReportFilters,
  parseOptionalNumber,
  SalesReportFiltersValues,
  salesReportFiltersSchema,
} from '@/features/dashboard/report.schema';
import {
  getSalesCategoryReportApi,
  getSalesMonthlyReportApi,
  getSalesProductReportApi,
} from '@/features/dashboard/report.api';
import {
  SalesCategoryReportItem,
  SalesMonthlyReportItem,
  SalesProductReportItem,
} from '@/features/dashboard/types';
import { PaginationMeta } from '@/types/api';

const DETAIL_LIMIT = 10;
const CHART_LIMIT = 24;

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: DETAIL_LIMIT,
  total: 0,
  totalPages: 0,
};

export function useSalesReport() {
  const defaultValues = createDefaultSalesReportFilters();
  const form = useForm<SalesReportFiltersValues>({
    resolver: zodResolver(salesReportFiltersSchema),
    defaultValues,
  });

  const [appliedFilters, setAppliedFilters] = useState<SalesReportFiltersValues>(defaultValues);
  const [categoryPage, setCategoryPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [monthlyItems, setMonthlyItems] = useState<SalesMonthlyReportItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<SalesCategoryReportItem[]>([]);
  const [productItems, setProductItems] = useState<SalesProductReportItem[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<PaginationMeta>(EMPTY_META);
  const [productMeta, setProductMeta] = useState<PaginationMeta>(EMPTY_META);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleApplyFilters = form.handleSubmit((values) => {
    setAppliedFilters(values);
    setCategoryPage(1);
    setProductPage(1);
  });

  function handleResetFilters() {
    form.reset(defaultValues);
    setAppliedFilters(defaultValues);
    setCategoryPage(1);
    setProductPage(1);
  }

  useEffect(() => {
    let isCancelled = false;

    async function fetchReport() {
      setIsLoading(true);
      setError(null);

      const storeId = parseOptionalNumber(appliedFilters.storeId);
      const categoryId = parseOptionalNumber(appliedFilters.categoryId);
      const productId = parseOptionalNumber(appliedFilters.productId);

      try {
        const [monthlyResponse, categoryResponse, productResponse] = await Promise.all([
          getSalesMonthlyReportApi({
            store_id: storeId,
            from: appliedFilters.fromDate,
            to: appliedFilters.toDate,
            page: 1,
            limit: CHART_LIMIT,
            sort: 'asc',
            sort_by: 'month',
          }),
          getSalesCategoryReportApi({
            store_id: storeId,
            category_id: categoryId,
            from: appliedFilters.fromDate,
            to: appliedFilters.toDate,
            page: categoryPage,
            limit: DETAIL_LIMIT,
            sort: 'desc',
            sort_by: 'total_sales',
          }),
          getSalesProductReportApi({
            store_id: storeId,
            category_id: categoryId,
            product_id: productId,
            from: appliedFilters.fromDate,
            to: appliedFilters.toDate,
            page: productPage,
            limit: DETAIL_LIMIT,
            sort: 'desc',
            sort_by: 'total_sales',
          }),
        ]);

        if (isCancelled) {
          return;
        }

        setMonthlyItems(monthlyResponse.items);
        setCategoryItems(categoryResponse.items);
        setProductItems(productResponse.items);
        setCategoryMeta(categoryResponse.meta);
        setProductMeta(productResponse.meta);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? 'Failed to load sales report')
          : 'Failed to load sales report';

        setError(message);
        toast.error(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchReport();

    return () => {
      isCancelled = true;
    };
  }, [appliedFilters, categoryPage, productPage]);

  return {
    form,
    monthlyItems,
    categoryItems,
    productItems,
    categoryMeta,
    productMeta,
    categoryPage,
    productPage,
    isLoading,
    error,
    handleApplyFilters,
    handleResetFilters,
    setCategoryPage,
    setProductPage,
  };
}
