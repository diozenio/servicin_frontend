import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
  CreateServicePayload,
  CreateServiceApiResponse,
} from "@/core/domain/models/service";
import { ApiResponse } from "@/core/types/api";

export abstract class ServiceUseCase {
  abstract findAll(
    params?: ServiceQueryParams
  ): Promise<ApiResponse<ServiceListResponse>>;
  abstract findById(id: string): Promise<ApiResponse<ServiceResponse>>;
  abstract create(
    payload: CreateServicePayload
  ): Promise<ApiResponse<CreateServiceApiResponse>>;
}
