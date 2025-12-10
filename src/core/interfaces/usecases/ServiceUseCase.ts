import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
  CreateServicePayload,
  CreateServiceApiResponse,
} from "@/core/domain/models/service";

export abstract class ServiceUseCase {
  abstract findAll(params?: ServiceQueryParams): Promise<ServiceListResponse>;
  abstract findById(id: string): Promise<ServiceResponse>;
  abstract create(
    payload: CreateServicePayload
  ): Promise<CreateServiceApiResponse>;
}
