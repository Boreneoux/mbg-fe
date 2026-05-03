'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useCart } from '@/features/cart/hooks/useCart';
import { useActiveDiscounts } from '@/features/discount/hooks/useActiveDiscounts';
import useLocationStore from '@/stores/useLocationStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { formatCurrencyIDR } from '@/utils/currency';
import { QuantityControl } from '@/features/cart/components/QuantityControl';
import { getBestDiscountPreview, getDefaultStoreId } from '@/features/products/pricing';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const { product, isLoading, error } = useProduct(slug);
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { discounts } = useActiveDiscounts();
  const { selectedStoreId } = useLocationStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-xl" />
              <Skeleton className="h-20 w-20 rounded-xl" />
            </div>
          </div>
          <div className="space-y-6 pt-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-500">
          {error ||
            "The product you're looking for doesn't exist or has been removed."}
        </p>
        <Button onClick={() => router.push('/products')} variant="outline">
          Back to Catalog
        </Button>
      </div>
    );
  }

  const primaryImage =
    product.product_images.find(img => img.is_primary)?.image_url ||
    product.product_images[0]?.image_url ||
    '/placeholder.png';

  const currentImage = selectedImage || primaryImage;
  const otherImages = product.product_images;

  const totalStock = product.store_inventories?.reduce((acc, inv) => acc + inv.stock, 0) || 0;
  const nearestStoreStock = selectedStoreId 
    ? (product.store_inventories?.find(inv => inv.store_id === selectedStoreId)?.stock || 0)
    : null;
  const displayStock = selectedStoreId ? (nearestStoreStock ?? 0) : totalStock;
  const isOutOfStock = displayStock === 0;

  const defaultStoreId = selectedStoreId || getDefaultStoreId(product) || '';
  const discountPreview = getBestDiscountPreview(product, discounts, quantity, defaultStoreId || null);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= displayStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity, defaultStoreId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/products')}
        className="-ml-2 text-gray-600 hover:text-gray-900">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border bg-white relative">
            <img
              src={currentImage}
              alt={product.name}
              className={`h-full w-full object-contain p-4 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/80 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {otherImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {otherImages.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                    currentImage === img.image_url
                      ? 'border-green-600 shadow-sm'
                      : 'border-transparent hover:border-gray-300'
                  }`}>
                  <img
                    src={img.image_url}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-8 pt-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-600">
                {product.category.name}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>
            <div className="space-y-2">
              {discountPreview ? (
                <>
                  <div className="inline-flex rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {discountPreview.badge}
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrencyIDR(
                        discountPreview.discountedPrice !== null
                          ? discountPreview.discountedPrice
                          : product.price
                      )}
                    </p>
                    {discountPreview.discountedPrice !== null && (
                      <p className="text-lg text-muted-foreground line-through">
                        {formatCurrencyIDR(product.price)}
                      </p>
                    )}
                  </div>
                  {discountPreview.description && (
                    <p className="text-sm font-medium text-rose-600">
                      {discountPreview.description}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrencyIDR(product.price)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Deskripsi
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description ||
                'Tidak deskripsi untuk produk ini.'}
            </p>
            <p className="text-sm text-gray-500">Berat: {product.weight} kg</p>
            <p className="text-sm text-gray-500">
              {selectedStoreId 
                ? `Sisa: ${nearestStoreStock}`
                : `Sisa: ${totalStock}`}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Jumlah
                </span>
                <QuantityControl
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  isLoading={isCartLoading}
                  minQuantity={1}
                  maxQuantity={displayStock}
                  allowInput
                />
              </div>
            )}

            <Button
              size="lg"
              className="w-full text-lg h-14 rounded-xl"
              disabled={isOutOfStock || isCartLoading}
              onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isOutOfStock
                ? 'Out of Stock'
                : isCartLoading
                  ? 'Menambahkan...'
                  : 'Tambahkan ke keranjang'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
