import {
  ServiceProviderByIdResponseData,
  UpdateServiceProviderPayload,
} from "@/core/domain/models/user";
import { ApiResponse } from "@/core/types/api";

export interface ServiceProviderUseCase {
  getById(id: string): Promise<ApiResponse<ServiceProviderByIdResponseData>>;
  updateSettings(
    id: string,
    payload: UpdateServiceProviderPayload
  ): Promise<ApiResponse<null>>;
}
