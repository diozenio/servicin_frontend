import {
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";

export abstract class LocationUseCase {
  abstract findAll(params?: LocationQueryParams): Promise<LocationListResponse>;
}
