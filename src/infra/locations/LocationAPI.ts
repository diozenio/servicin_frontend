import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";
import { client } from "@/lib/client";

export class LocationAPI extends LocationAdapter {
  async getStates(): Promise<StateListResponse> {
    try {
      const response = await client.get("/locations/states");
      return {
        success: response.data.success ?? true,
        data: response.data.data || [],
        message: response.data.message,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch states",
      };
    }
  }

  async getCitiesByState(stateId: string): Promise<CityListResponse> {
    try {
      const response = await client.get(`/locations/states/${stateId}/cities`);
      return {
        success: response.data.success ?? true,
        data: response.data.data || [],
        message: response.data.message,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch cities",
      };
    }
  }
}
