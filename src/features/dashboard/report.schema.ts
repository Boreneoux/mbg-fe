import { z } from 'zod';
import { ReportStockJournalType } from '@/features/dashboard/types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const baseFiltersSchema = z.object({
  storeId: z.string(),
  categoryId: z.string(),
  productId: z.string(),
  fromDate: z.string().regex(DATE_PATTERN, 'Select a valid start date'),
  toDate: z.string().regex(DATE_PATTERN, 'Select a valid end date'),
});

export const salesReportFiltersSchema = baseFiltersSchema.refine(
  (values) => values.fromDate <= values.toDate,
  {
    message: 'Start date must be earlier than or equal to end date',
    path: ['toDate'],
  }
);

export const stockReportFiltersSchema = baseFiltersSchema
  .extend({
    type: z.union([
      z.literal('all'),
      z.literal('addition'),
      z.literal('reduction'),
      z.literal('mutation_in'),
      z.literal('mutation_out'),
      z.literal('order_deduction'),
      z.literal('order_cancellation_return'),
    ]),
    search: z.string().max(100, 'Search must be 100 characters or fewer'),
  })
  .refine((values) => values.fromDate <= values.toDate, {
    message: 'Start date must be earlier than or equal to end date',
    path: ['toDate'],
  });

export type SalesReportFiltersValues = z.infer<typeof salesReportFiltersSchema>;
export type StockReportFiltersValues = z.infer<typeof stockReportFiltersSchema>;

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDefaultDateRange(monthSpan = 5) {
  const currentDate = new Date();
  const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthSpan, 1);

  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(currentDate),
  };
}

export function createDefaultSalesReportFilters(): SalesReportFiltersValues {
  const { fromDate, toDate } = getDefaultDateRange();

  return {
    storeId: 'all',
    categoryId: 'all',
    productId: 'all',
    fromDate,
    toDate,
  };
}

export function createDefaultStockReportFilters(): StockReportFiltersValues {
  const { fromDate, toDate } = getDefaultDateRange();

  return {
    storeId: 'all',
    categoryId: 'all',
    productId: 'all',
    type: 'all',
    search: '',
    fromDate,
    toDate,
  };
}

export function parseOptionalNumber(value: string) {
  if (value === 'all') {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

export function parseOptionalStockType(value: 'all' | ReportStockJournalType) {
  return value === 'all' ? undefined : value;
}

