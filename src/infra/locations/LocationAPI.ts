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
        data: response.data,
        success: true,
        message: "States fetched successfully",
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
        data: response.data,
        success: true,
        message: "Cities fetched successfully",
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

