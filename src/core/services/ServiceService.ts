import { ServiceUseCase } from "@/core/interfaces/usecases/ServiceUseCase";
import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";

export class ServiceService extends ServiceUseCase {
  constructor(private serviceAdapter: ServiceAdapter) {
    super();
  }

  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    return await this.serviceAdapter.findAll(params);
  }
}
