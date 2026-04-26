import { z } from 'zod';
import { ReportStockJournalType } from '@/features/dashboard/types';

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const baseFiltersSchema = z.object({
  storeId: z.string(),
  categoryId: z.string(),
  productId: z.string(),
  fromMonth: z.string().regex(MONTH_PATTERN, 'Select a valid month'),
  toMonth: z.string().regex(MONTH_PATTERN, 'Select a valid month'),
});

export const salesReportFiltersSchema = baseFiltersSchema.refine(
  (values) => values.fromMonth <= values.toMonth,
  {
    message: 'From month must be earlier than or equal to To month',
    path: ['toMonth'],
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
  .refine((values) => values.fromMonth <= values.toMonth, {
    message: 'From month must be earlier than or equal to To month',
    path: ['toMonth'],
  });

export type SalesReportFiltersValues = z.infer<typeof salesReportFiltersSchema>;
export type StockReportFiltersValues = z.infer<typeof stockReportFiltersSchema>;

function formatMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export function getDefaultMonthRange(monthSpan = 5) {
  const currentMonth = new Date();
  const fromMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - monthSpan, 1);

  return {
    fromMonth: formatMonth(fromMonth),
    toMonth: formatMonth(currentMonth),
  };
}

export function createDefaultSalesReportFilters(): SalesReportFiltersValues {
  const { fromMonth, toMonth } = getDefaultMonthRange();

  return {
    storeId: 'all',
    categoryId: 'all',
    productId: 'all',
    fromMonth,
    toMonth,
  };
}

export function createDefaultStockReportFilters(): StockReportFiltersValues {
  const { fromMonth, toMonth } = getDefaultMonthRange();

  return {
    storeId: 'all',
    categoryId: 'all',
    productId: 'all',
    type: 'all',
    search: '',
    fromMonth,
    toMonth,
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

export function createMonthDateRange(fromMonth: string, toMonth: string) {
  const [fromYear, fromMonthNumber] = fromMonth.split('-').map(Number);
  const [toYear, toMonthNumber] = toMonth.split('-').map(Number);
  const lastDayOfMonth = new Date(toYear, toMonthNumber, 0).getDate();

  return {
    from: `${fromYear}-${String(fromMonthNumber).padStart(2, '0')}-01`,
    to: `${toYear}-${String(toMonthNumber).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`,
  };
}
