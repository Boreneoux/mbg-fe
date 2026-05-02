import { PaginationMeta } from '@/types/api';

export type ReportStockJournalType =
  | 'addition'
  | 'reduction'
  | 'mutation_in'
  | 'mutation_out'
  | 'order_deduction'
  | 'order_cancellation_return';

export type SalesMonthlyReportItem = {
  month: string;
  total_sales: number;
  total_orders: number;
  total_items: number;
};

export type SalesCategoryReportItem = {
  category_id: string;
  category_name: string;
  total_sales: number;
  total_quantity: number;
  total_orders: number;
};

export type SalesProductReportItem = {
  product_id: string;
  product_name: string;
  product_slug: string;
  category_id: string;
  category_name: string;
  total_sales: number;
  total_quantity: number;
  total_orders: number;
};

export type StockMonthlyReportItem = {
  month: string;
  total_in: number;
  total_out: number;
  net_change: number;
  total_entries: number;
};

export type StockHistoryReportItem = {
  id: string;
  created_at: string;
  type: ReportStockJournalType;
  quantity: number;
  description: string | null;
  reference_id: string | null;
  store_id: string;
  store_name: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  category_id: string;
  category_name: string;
};

export type ReportListResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type SalesMonthlyReportParams = {
  store_id?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sort_by?: 'month' | 'total_sales' | 'total_orders' | 'total_items';
};

export type SalesCategoryReportParams = {
  store_id?: string;
  category_id?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sort_by?: 'category_name' | 'total_sales' | 'total_quantity' | 'total_orders';
};

export type SalesProductReportParams = {
  store_id?: string;
  category_id?: string;
  product_id?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sort_by?:
  | 'product_name'
  | 'category_name'
  | 'total_sales'
  | 'total_quantity'
  | 'total_orders';
};

export type StockMonthlyReportParams = {
  store_id?: string;
  product_id?: string;
  type?: ReportStockJournalType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sort_by?: 'month' | 'total_in' | 'total_out' | 'net_change' | 'total_entries';
};

export type StockHistoryReportParams = {
  store_id?: string;
  product_id?: string;
  category_id?: string;
  type?: ReportStockJournalType;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sort_by?: 'created_at' | 'quantity' | 'type' | 'product_name' | 'category_name';
};
