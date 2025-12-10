import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import { LocationUseCase } from "@/core/interfaces/usecases/LocationUseCase";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";

export class LocationService implements LocationUseCase {
  constructor(private locationAdapter: LocationAdapter) {}

  async getStates(): Promise<StateListResponse> {
    return await this.locationAdapter.getStates();
  }

  async getCitiesByState(stateId: string): Promise<CityListResponse> {
    return await this.locationAdapter.getCitiesByState(stateId);
  }
}
