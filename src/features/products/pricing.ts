import type { Discount } from '@/features/discount/types';
import type { Product } from '@/features/products/types';

export type ProductDiscountPreview = {
  discount: Discount;
  discountedPrice: number | null;
  savingsAmount: number | null;
  badge: string;
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

    if (discount.type === 'buy_one_get_one') {
      const freeQuantity = Math.floor(quantity / 2);
      savingsAmount = unitPrice * freeQuantity;
      badge = 'Buy 1 Get 1';
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
    } else if (discount.type === 'nominal') {
      const nominalValue = toNumber(discount.value);
      if (!nominalValue) {
        continue;
      }

      savingsAmount = Math.min(nominalValue, lineTotal);
      discountedPrice = Math.max(unitPrice - savingsAmount / quantity, 0);
      badge = 'Discount';
    }

    if (savingsAmount <= 0) {
      continue;
    }

    const preview: ProductDiscountPreview = {
      discount,
      discountedPrice,
      savingsAmount,
      badge,
    };

    if (!bestPreview || preview.savingsAmount! > bestPreview.savingsAmount!) {
      bestPreview = preview;
    }
  }

  return bestPreview;
}
