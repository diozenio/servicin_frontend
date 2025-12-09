import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";

export class LocationService {
  constructor(private locationAdapter: LocationAdapter) {}

  async getStates(): Promise<StateListResponse> {
    return await this.locationAdapter.getStates();
  }

  async getCitiesByState(stateId: string): Promise<CityListResponse> {
    return await this.locationAdapter.getCitiesByState(stateId);
  }
}
