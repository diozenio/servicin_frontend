import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";
import { client } from "@/lib/client";

export class LocationAPI extends LocationAdapter {
  async getStates(): Promise<StateListResponse> {
    const { data } = await client.get("/locations/states");
    return data;
  }

  async getCitiesByState(stateId: string): Promise<CityListResponse> {
    const { data } = await client.get(`/locations/states/${stateId}/cities`);
    return data;
  }
}
