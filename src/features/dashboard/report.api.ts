import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Category } from '@/features/categories/types';
import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';
import {
  ReportListResponse,
  SalesCategoryReportItem,
  SalesCategoryReportParams,
  SalesMonthlyReportItem,
  SalesMonthlyReportParams,
  SalesProductReportItem,
  SalesProductReportParams,
  StockHistoryReportItem,
  StockHistoryReportParams,
  StockMonthlyReportItem,
  StockMonthlyReportParams,
} from '@/features/dashboard/types';

type StoreLookupResponse = {
  stores: Store[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ProductLookupResponse = ApiResponse<Product[]> & {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const LOOKUP_PAGE_LIMIT = 100;

export async function getReportStoresApi() {
  const stores: Store[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const { data } = await axiosInstance.get<ApiResponse<StoreLookupResponse>>('/stores', {
      params: { page, limit: LOOKUP_PAGE_LIMIT },
    });

    stores.push(...data.data.stores);
    totalPages = data.data.meta.totalPages;
    page += 1;
  }

  return stores;
}

export async function getReportCategoriesApi() {
  const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/categories');

  return data.data;
}

export async function getReportProductsApi() {
  const products: Product[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const { data } = await axiosInstance.get<ProductLookupResponse>('/products', {
      params: { page, limit: LOOKUP_PAGE_LIMIT },
    });

    products.push(...data.data);
    totalPages = data.meta?.totalPages ?? 1;
    page += 1;
  }

  return products;
}

export async function getSalesMonthlyReportApi(params: SalesMonthlyReportParams) {
  const { data } = await axiosInstance.get<ApiResponse<ReportListResponse<SalesMonthlyReportItem>>>(
    '/reports/sales/monthly',
    { params }
  );

  return data.data;
}

export async function getSalesCategoryReportApi(params: SalesCategoryReportParams) {
  const { data } = await axiosInstance.get<ApiResponse<ReportListResponse<SalesCategoryReportItem>>>(
    '/reports/sales/categories',
    { params }
  );

  return data.data;
}

export async function getSalesProductReportApi(params: SalesProductReportParams) {
  const { data } = await axiosInstance.get<ApiResponse<ReportListResponse<SalesProductReportItem>>>(
    '/reports/sales/products',
    { params }
  );

  return data.data;
}

export async function getStockMonthlyReportApi(params: StockMonthlyReportParams) {
  const { data } = await axiosInstance.get<ApiResponse<ReportListResponse<StockMonthlyReportItem>>>(
    '/reports/stock/monthly',
    { params }
  );

  return data.data;
}

export async function getStockHistoryReportApi(params: StockHistoryReportParams) {
  const { data } = await axiosInstance.get<ApiResponse<ReportListResponse<StockHistoryReportItem>>>(
    '/reports/stock/history',
    { params }
  );

  return data.data;
}
