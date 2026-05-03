import type { Discount } from '@/features/discount/types';
import type { Product } from '@/features/products/types';
import { formatCurrencyIDR } from '@/utils/currency';

export type ProductDiscountPreview = {
  discount: Discount;
  discountedPrice: number | null;
  savingsAmount: number | null;
  badge: string;
  description: string | null; // e.g. "Save Rp x with minimum purchase of Rp y"
};

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function isDiscountActive(discount: Discount, now = new Date()) {
  if (!discount.is_active) {
    return false;
  }

  if (discount.started_at && new Date(discount.started_at) > now) {
    return false;
  }

  if (discount.expired_at && new Date(discount.expired_at) < now) {
    return false;
  }

  return true;
}

export function getDefaultStoreId(product: Product) {
  return product.store_inventories?.find((inventory) => inventory.stock > 0)?.store_id ?? null;
}

export function getBestDiscountPreview(
  product: Product,
  discounts: Discount[],
  quantity = 1,
  storeId = getDefaultStoreId(product)
): ProductDiscountPreview | null {
  if (!storeId || quantity < 1) {
    return null;
  }

  const applicableDiscounts = discounts.filter((discount) => {
    if (!isDiscountActive(discount)) {
      return false;
    }

    if (discount.store_id !== storeId) {
      return false;
    }

    return discount.product_id === null || discount.product_id === product.id;
  });

  if (applicableDiscounts.length === 0) {
    return null;
  }

  const unitPrice = Number(product.price);
  const lineTotal = unitPrice * quantity;
  let bestPreview: ProductDiscountPreview | null = null;

  for (const discount of applicableDiscounts) {
    let discountedPrice: number | null = null;
    let savingsAmount = 0;
    let badge = '';
    let description: string | null = null;

    const minPurchase = toNumber(discount.min_purchase_amount);

    if (discount.type === 'buy_one_get_one') {
      const freeQuantity = Math.floor(quantity / 2);
      savingsAmount = unitPrice * freeQuantity;
      badge = 'Buy 1 Get 1';
      description = freeQuantity > 0
        ? `Buy ${quantity}, get ${freeQuantity} free!`
        : 'Buy 1 Get 1 — add 2 items to save!';
    } else if (discount.type === 'percentage') {
      const percentageValue = toNumber(discount.value);
      if (!percentageValue) {
        continue;
      }

      savingsAmount = lineTotal * (percentageValue / 100);
      const maxDiscountValue = toNumber(discount.max_discount_value);
      if (maxDiscountValue !== null) {
        savingsAmount = Math.min(savingsAmount, maxDiscountValue);
      }

      discountedPrice = Math.max(unitPrice - savingsAmount / quantity, 0);
      badge = `${percentageValue}% OFF`;
      description = minPurchase && minPurchase > 0
        ? `Save ${formatCurrencyIDR(savingsAmount)} with min. purchase ${formatCurrencyIDR(minPurchase)}`
        : `Save ${formatCurrencyIDR(savingsAmount)}`;
    } else if (discount.type === 'nominal') {
      const nominalValue = toNumber(discount.value);
      if (!nominalValue) {
        continue;
      }

      savingsAmount = Math.min(nominalValue, lineTotal);
      discountedPrice = Math.max(unitPrice - savingsAmount / quantity, 0);
      badge = 'Discount';
      description = minPurchase && minPurchase > 0
        ? `Save ${formatCurrencyIDR(savingsAmount)} with min. purchase ${formatCurrencyIDR(minPurchase)}`
        : `Save ${formatCurrencyIDR(savingsAmount)}`;
    }

    if (savingsAmount <= 0 && discount.type !== 'buy_one_get_one') {
      continue;
    }

    const preview: ProductDiscountPreview = {
      discount,
      discountedPrice,
      savingsAmount,
      badge,
      description,
    };

    if (!bestPreview || preview.savingsAmount! > bestPreview.savingsAmount! || (discount.type === 'buy_one_get_one' && !bestPreview)) {
      bestPreview = preview;
    }
  }

  return bestPreview;
}
