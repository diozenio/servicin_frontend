import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { container } from "@/container";
import { Location } from "@/core/domain/models/location";
import { LocationListResponse } from "@/core/domain/models/location";
import { debounce } from "@/lib/debounce";

export function useLocations() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: locationsResponse,
    isLoading,
    error,
  } = useQuery<LocationListResponse>({
    queryKey: ["locations", searchTerm],
    queryFn: (): Promise<LocationListResponse> =>
      container.locationService.findAll({
        search: searchTerm || undefined,
      }),
  });

  const locations: Location[] = locationsResponse?.data || [];

  const searchLocations = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    locations,
    searchLocations,
    clearSearch,
    isLoading,
    error,
  };
}
