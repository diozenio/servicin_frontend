import { LocationUseCase } from "@/core/interfaces/usecases/LocationUseCase";
import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";

export class LocationService extends LocationUseCase {
  constructor(private locationAdapter: LocationAdapter) {
    super();
  }

  async findAll(params?: LocationQueryParams): Promise<LocationListResponse> {
    return await this.locationAdapter.findAll(params);
  }
}
