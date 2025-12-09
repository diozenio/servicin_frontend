import { Location } from "@/core/domain/models/location";

export function useLocation(locationId: string | null) {
  return {
    location: null as Location | null,
    isLoading: false,
    error: null,
  };
}
