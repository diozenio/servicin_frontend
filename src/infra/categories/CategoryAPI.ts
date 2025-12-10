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
    const { data } = await client.get("/categories/");
    return data;
  }

  async fetchById(id: number): Promise<CategoryResponse> {
    if (!id) {
      return { success: false, data: null };
    }

    const { data } = await client.get(`/categories/${id}`);
    return data;
  }

  async create(
    payload: CreateCategoryPayload
  ): Promise<CreateCategoryApiResponse> {
    const { data } = await client.post("/categories/", payload);
    return data;
  }
}
