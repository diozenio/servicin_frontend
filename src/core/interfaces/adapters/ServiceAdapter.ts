import {
  ServiceListResponse,
  ServiceQueryParams,
  ServiceResponse,
} from "@/core/domain/models/service";

export abstract class ServiceAdapter {
  abstract findAll(params?: ServiceQueryParams): Promise<ServiceListResponse>;
  abstract findById(id: string): Promise<ServiceResponse>;
}
