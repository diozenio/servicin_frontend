import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";
import { client } from "@/lib/client";

export class LocationAPI extends LocationAdapter {
  async getStates(): Promise<StateListResponse> {
    const response = await client.get("/locations/states");
    return response.data || { data: [] };
  }

  async getCitiesByState(stateId: string): Promise<CityListResponse> {
    const response = await client.get(`/locations/states/${stateId}/cities`);
    return response.data || { data: [] };
  }
}
