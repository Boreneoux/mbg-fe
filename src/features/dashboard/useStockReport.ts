'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createDefaultStockReportFilters,
  parseOptionalId,
  parseOptionalStockType,
  stockReportFiltersSchema,
  StockReportFiltersValues,
} from '@/features/dashboard/report.schema';
import {
  getStockHistoryReportApi,
  getStockMonthlyReportApi,
} from '@/features/dashboard/report.api';
import {
  StockHistoryReportItem,
  StockMonthlyReportItem,
} from '@/features/dashboard/types';
import { PaginationMeta } from '@/types/api';

const DETAIL_LIMIT = 10;

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: DETAIL_LIMIT,
  total: 0,
  totalPages: 0,
};

export function useStockReport() {
  const defaultValues = createDefaultStockReportFilters();
  const form = useForm<StockReportFiltersValues>({
    resolver: zodResolver(stockReportFiltersSchema),
    defaultValues,
  });

  const [appliedFilters, setAppliedFilters] = useState<StockReportFiltersValues>(defaultValues);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [monthlyItems, setMonthlyItems] = useState<StockMonthlyReportItem[]>([]);
  const [historyItems, setHistoryItems] = useState<StockHistoryReportItem[]>([]);
  const [monthlyMeta, setMonthlyMeta] = useState<PaginationMeta>(EMPTY_META);
  const [historyMeta, setHistoryMeta] = useState<PaginationMeta>(EMPTY_META);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleApplyFilters = form.handleSubmit((values) => {
    setAppliedFilters(values);
    setMonthlyPage(1);
    setHistoryPage(1);
  });

  function handleResetFilters() {
    form.reset(defaultValues);
    setAppliedFilters(defaultValues);
    setMonthlyPage(1);
    setHistoryPage(1);
  }

  useEffect(() => {
    let isCancelled = false;

    async function fetchReport() {
      setIsLoading(true);
      setError(null);

      const storeId = parseOptionalId(appliedFilters.storeId);
      const categoryId = parseOptionalId(appliedFilters.categoryId);
      const productId = parseOptionalId(appliedFilters.productId);
      const stockType = parseOptionalStockType(appliedFilters.type);
      const search = appliedFilters.search.trim() || undefined;

      try {
        const [monthlyResponse, historyResponse] = await Promise.all([
          getStockMonthlyReportApi({
            store_id: storeId,
            product_id: productId,
            type: stockType,
            from: appliedFilters.fromDate,
            to: appliedFilters.toDate,
            page: monthlyPage,
            limit: DETAIL_LIMIT,
            sort: 'desc',
            sort_by: 'month',
          }),
          getStockHistoryReportApi({
            store_id: storeId,
            category_id: categoryId,
            product_id: productId,
            type: stockType,
            search,
            from: appliedFilters.fromDate,
            to: appliedFilters.toDate,
            page: historyPage,
            limit: DETAIL_LIMIT,
            sort: 'desc',
            sort_by: 'created_at',
          }),
        ]);

        if (isCancelled) {
          return;
        }

        setMonthlyItems(monthlyResponse.items);
        setHistoryItems(historyResponse.items);
        setMonthlyMeta(monthlyResponse.meta);
        setHistoryMeta(historyResponse.meta);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? 'Failed to load stock report')
          : 'Failed to load stock report';

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
  }, [appliedFilters, monthlyPage, historyPage]);

  return {
    form,
    monthlyItems,
    historyItems,
    monthlyMeta,
    historyMeta,
    monthlyPage,
    historyPage,
    isLoading,
    error,
    handleApplyFilters,
    handleResetFilters,
    setMonthlyPage,
    setHistoryPage,
  };
}
