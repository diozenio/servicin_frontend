import { ApiResponse } from "@/core/types/api";

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type CreateCategoryPayload = {
  name: string;
  description: string;
};

export type CreateCategoryResponse = {
  id: number;
  name: string;
  description: string | null;
};

export type CategoriesResponse = ApiResponse<Category[]>;

export type CategoryResponse = ApiResponse<Category | null>;

export type CreateCategoryApiResponse = ApiResponse<CreateCategoryResponse>;
