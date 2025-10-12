import { useQuery } from "@tanstack/react-query";
import { container } from "@/container";
import { Location } from "@/core/domain/models/location";

export function useLocation(locationId: string | null) {
  const {
    data: location,
    isLoading,
    error,
  } = useQuery<Location | null>({
    queryKey: ["location", locationId],
    queryFn: async (): Promise<Location | null> => {
      if (!locationId) return null;

      // Get all locations and find the one with matching ID
      const response = await container.locationService.findAll();
      const locations = response.data || [];
      return locations.find((loc) => loc.id === locationId) || null;
    },
    enabled: !!locationId,
  });

  return {
    location,
    isLoading,
    error,
  };
}
