import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";
import { search } from "@/lib/search";
import { mockLocations } from "./mock-data";

export class LocationMock extends LocationAdapter {
  async findAll(params?: LocationQueryParams): Promise<LocationListResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const locations = mockLocations;

      let filteredLocations = locations;

      if (params?.search) {
        filteredLocations = search(locations, params.search, {
          keys: ["label"],
          caseSensitive: false,
        });
      }

      return {
        data: filteredLocations,
        success: true,
        message: "Locations fetched successfully",
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch locations",
      };
    }
  }
}
