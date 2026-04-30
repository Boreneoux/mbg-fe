export type Category = {
  id: string;
  slug: string;
  name: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};

import { ApiResponse } from '@/types/api';

export type CreateCategoryPayload = {
  name: string;
  photo?: File;
};

export type UpdateCategoryPayload = {
  name?: string;
  photo?: File;
};

export type CategoriesResponse = ApiResponse<Category[]>;

export type CategoryDetailResponse = ApiResponse<Category>;

export type CreateCategoryResponse = ApiResponse<Category>;

export type UpdateCategoryResponse = ApiResponse<Category>;

export type DeleteCategoryResponse = ApiResponse<null>;
