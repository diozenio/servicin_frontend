import { CategoryAdapter } from "@/core/interfaces/adapters/CategoryAdapter";
import { CategoryUseCase } from "@/core/interfaces/usecases/CategoryUseCase";
import {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryPayload,
  CreateCategoryApiResponse,
} from "@/core/domain/models/category";

export class CategoryService implements CategoryUseCase {
  constructor(private categoryAdapter: CategoryAdapter) {}

  async fetchAll(): Promise<CategoriesResponse> {
    return await this.categoryAdapter.fetchAll();
  }

  async fetchById(id: number): Promise<CategoryResponse> {
    return await this.categoryAdapter.fetchById(id);
  }

  async create(
    payload: CreateCategoryPayload
  ): Promise<CreateCategoryApiResponse> {
    return await this.categoryAdapter.create(payload);
  }
}
