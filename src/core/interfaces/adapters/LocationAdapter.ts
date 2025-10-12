import {
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";

export abstract class LocationAdapter {
  abstract findAll(params?: LocationQueryParams): Promise<LocationListResponse>;
}
