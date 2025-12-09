import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";

export class LocationMock extends LocationAdapter {
  async getStates(): Promise<StateListResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: [],
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: [],
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
