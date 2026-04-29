/**
 * Formats a number as Indonesian Rupiah currency.
 * Output example: Rp 15.000
 *
 * Used everywhere a price needs to be displayed.
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

export const formatCurrencyIDR = formatPrice;
