import { LocationAdapter } from "@/core/interfaces/adapters/LocationAdapter";
import {
  Location,
  LocationListResponse,
  LocationQueryParams,
} from "@/core/domain/models/location";
import { search } from "@/lib/search";

export class LocationMock extends LocationAdapter {
  async findAll(params?: LocationQueryParams): Promise<LocationListResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const locations: Location[] = [
        { value: "sao-paulo", label: "São Paulo, SP" },
        { value: "rio-de-janeiro", label: "Rio de Janeiro, RJ" },
        { value: "belo-horizonte", label: "Belo Horizonte, MG" },
        { value: "salvador", label: "Salvador, BA" },
        { value: "brasilia", label: "Brasília, DF" },
        { value: "fortaleza", label: "Fortaleza, CE" },
        { value: "manaus", label: "Manaus, AM" },
        { value: "curitiba", label: "Curitiba, PR" },
      ];

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
