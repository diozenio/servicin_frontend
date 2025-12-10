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
      success: response.data.success ?? true,
      data: response.data.data || [],
      message: response.data.message,
    };
  }

  async fetchById(id: number): Promise<CategoryResponse> {
    if (!id) {
      return { success: false, data: null };
    }

    try {
      const response = await client.get(`/categories/${id}`);
      return {
        success: response.data.success ?? true,
        data: response.data.data || null,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
      };
    }
  }

  async create(
    payload: CreateCategoryPayload
  ): Promise<CreateCategoryApiResponse> {
    const response = await client.post("/categories/", payload);
    return {
      success: response.data.success ?? true,
      data: response.data.data,
      message: response.data.message,
    };
  }
}
