import {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryPayload,
  CreateCategoryApiResponse,
} from "@/core/domain/models/category";
import { ApiResponse } from "@/core/types/api";

export interface CategoryAdapter {
  fetchAll(): Promise<CategoriesResponse>;
  fetchById(id: number): Promise<CategoryResponse>;
  create(payload: CreateCategoryPayload): Promise<CreateCategoryApiResponse>;
}
