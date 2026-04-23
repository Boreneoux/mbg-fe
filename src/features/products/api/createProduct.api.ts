import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';
import { CreateProductFormValues } from '@/features/products/schemas/product.schema';

export async function createProductApi(payload: CreateProductFormValues) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('description', payload.description);
  formData.append('price', payload.price.toString());
  formData.append('weight', payload.weight.toString());
  formData.append('category_id', payload.category_id.toString());

  if (payload.primaryIndex !== undefined) {
    formData.append('primaryIndex', payload.primaryIndex.toString());
  }

  if (payload.photos && payload.photos.length > 0) {
    payload.photos.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await axiosInstance.post<ApiResponse<Product>>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
