import {
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";

export abstract class ServiceAdapter {
  abstract findAll(params?: ServiceQueryParams): Promise<ServiceListResponse>;
}
