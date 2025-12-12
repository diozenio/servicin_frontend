import { ServiceProviderUseCase } from "@/core/interfaces/usecases/ServiceProviderUseCase";
import { ApiResponse } from "@/core/types/api";
import { ServiceProviderAdapter } from "../interfaces/adapters/ServiceProviderAdpter";
import {
  ServiceProviderByIdResponseData,
  UpdateServiceProviderPayload,
} from "../domain/models/user";

export class ServiceProviderService implements ServiceProviderUseCase {
  constructor(private providerAdapter: ServiceProviderAdapter) {}

  async getById(
    id: string
  ): Promise<ApiResponse<ServiceProviderByIdResponseData>> {
    return await this.providerAdapter.getById(id);
  }

  async updateSettings(
    id: string,
    payload: UpdateServiceProviderPayload
  ): Promise<ApiResponse<null>> {
    return await this.providerAdapter.updateSettings(id, payload);
  }
}
