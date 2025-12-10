import { ServiceUseCase } from "@/core/interfaces/usecases/ServiceUseCase";
import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
  CreateServicePayload,
  CreateServiceApiResponse,
} from "@/core/domain/models/service";
import { ApiResponse } from "../types/api";

export class ServiceService extends ServiceUseCase {
  constructor(private serviceAdapter: ServiceAdapter) {
    super();
  }

  async findAll(
    params?: ServiceQueryParams
  ): Promise<ApiResponse<ServiceListResponse>> {
    return await this.serviceAdapter.findAll(params);
  }

  async findById(id: string): Promise<ApiResponse<ServiceResponse>> {
    return await this.serviceAdapter.findById(id);
  }

  async create(
    payload: CreateServicePayload
  ): Promise<ApiResponse<CreateServiceApiResponse>> {
    return await this.serviceAdapter.create(payload);
  }
}
