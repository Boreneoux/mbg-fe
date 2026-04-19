import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';
import { UpdateProductFormValues } from '@/features/products/schemas/product.schema';

export async function updateProductApi(id: number, payload: UpdateProductFormValues) {
  const formData = new FormData();
  
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.price !== undefined) formData.append('price', payload.price.toString());
  if (payload.weight !== undefined) formData.append('weight', payload.weight.toString());
  if (payload.category_id !== undefined) formData.append('category_id', payload.category_id.toString());

  if (payload.photos && payload.photos.length > 0) {
    payload.photos.forEach((file) => {
      formData.append('photos', file);
    });
  }

  const response = await axiosInstance.put<ApiResponse<{ product: Product }>>(
    `/products/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data.product;
}
