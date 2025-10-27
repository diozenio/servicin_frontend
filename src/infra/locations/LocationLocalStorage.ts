import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";
import { search } from "@/lib/search";
import { LocalStorage, STORAGE_KEYS } from "@/lib/local-storage";
import { mockLocations } from "./mock-data";

export class LocationLocalStorage extends LocationAdapter {
  private getLocations() {
    const locations = LocalStorage.get(STORAGE_KEYS.LOCATIONS, mockLocations);

    // Initialize with mock data if storage is empty
    if (!LocalStorage.has(STORAGE_KEYS.LOCATIONS)) {
      LocalStorage.set(STORAGE_KEYS.LOCATIONS, mockLocations);
      return mockLocations;
    }

    return locations;
  }

  async findAll(params?: LocationQueryParams): Promise<LocationListResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const locations = this.getLocations();

      let filteredLocations = locations;

      if (params?.search) {
        filteredLocations = search(locations, params.search, {
          keys: ["label"],
          caseSensitive: false,
        });
      }

      // Apply limit if provided
      if (params?.limit && params.limit > 0) {
        filteredLocations = filteredLocations.slice(0, params.limit);
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
