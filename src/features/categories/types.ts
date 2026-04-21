export type Category = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  photo?: File;
};

export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  photo?: File;
};

export type CategoriesResponse = Category[];

export type CategoryDetailResponse = Category;

export type CreateCategoryResponse = Category;

export type UpdateCategoryResponse = Category;

export type DeleteCategoryResponse = {
  message: string;
};
