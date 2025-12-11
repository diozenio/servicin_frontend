import {
  CreateCategoryPayload,
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryApiResponse,
} from "@/core/domain/models/category";
import { CategoryAdapter } from "@/core/interfaces/adapters/CategoryAdapter";
import { client } from "@/lib/client";

export class CategoryAPI implements CategoryAdapter {
  async fetchAll(): Promise<CategoriesResponse> {
    const response = await client.get("/categories/");
    return {
      data: response.data || [],
      success: true,
    };
  }

  async fetchById(id: number): Promise<CategoryResponse> {
    if (!id) {
      return { success: false, data: null };
    }

    const response = await client.get(`/categories/${id}`);
    return {
      data: response.data || null,
      success: true,
    };
  }

  async create(
    payload: CreateCategoryPayload
  ): Promise<CreateCategoryApiResponse> {
    const response = await client.post("/categories/", payload);
    return {
      data: response.data,
      success: true,
    };
  }
}
