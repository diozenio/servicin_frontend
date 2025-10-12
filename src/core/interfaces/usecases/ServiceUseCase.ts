import {
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";

export abstract class ServiceUseCase {
  abstract findAll(params?: ServiceQueryParams): Promise<ServiceListResponse>;
}
