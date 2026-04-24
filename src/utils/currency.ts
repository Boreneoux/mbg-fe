/**
 * Format price with IDR currency symbol
 * Used specifically in product management module
 */
export function formatCurrencyIDR(value: number): string {
  return `Rp${value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format price as number with decimal places
 * Used for input fields
 */
export function formatPriceNumber(value: number): string {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
