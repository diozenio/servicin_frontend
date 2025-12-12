import {
  CreateServiceProviderPayload,
  ServiceProviderByIdResponseData,
  UpdateServiceProviderPayload,
} from "@/core/domain/models/user";
import { ApiResponse } from "@/core/types/api";

export interface ServiceProviderUseCase {
  getById(id: string): Promise<ApiResponse<ServiceProviderByIdResponseData>>;
  create(payload: CreateServiceProviderPayload): Promise<ApiResponse<null>>;
  updateSettings(
    id: string,
    payload: UpdateServiceProviderPayload
  ): Promise<ApiResponse<null>>;
}
