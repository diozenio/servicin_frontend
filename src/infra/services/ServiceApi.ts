import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
  CreateServicePayload,
  CreateServiceApiResponse,
} from "@/core/domain/models/service";
import { client } from "@/lib/client";
import { ApiResponse } from "@/core/types/api";

export class ServiceApi extends ServiceAdapter {
  async findAll(
    params?: ServiceQueryParams
  ): Promise<ApiResponse<ServiceListResponse>> {
    const queryParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 12,
      q: params?.q,
      providerName: params?.providerName,
      category: params?.category,
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      minRating: params?.minRating,
      stateId: params?.stateId,
      cityId: params?.cityId,
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
    );

    const { data } = await client.get("/services/", {
      params: cleanParams,
    });

    return data;
  }

  async findById(id: string): Promise<ApiResponse<ServiceResponse>> {
    const { data } = await client.get(`/services/${id}`);
    return data;
  }

  async create(
    payload: CreateServicePayload
  ): Promise<ApiResponse<CreateServiceApiResponse>> {
    const { data } = await client.post("/services/", payload);
    return data;
  }
}
