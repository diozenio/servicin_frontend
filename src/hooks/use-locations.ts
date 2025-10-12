import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { services } from "@/container";
import { Location } from "@/core/domain/models/location";
import { LocationListResponse } from "@/core/domain/models/location";
import { debounce } from "@/lib/debounce";

export function useLocations() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: locationsResponse,
    isLoading,
    error,
  } = useQuery<LocationListResponse>({
    queryKey: ["locations", searchTerm],
    queryFn: (): Promise<LocationListResponse> =>
      services.locationService.findAll({
        search: searchTerm || undefined,
      }),
  });

  const locations: Location[] = useMemo(
    () => locationsResponse?.data || [],
    [locationsResponse]
  );

  const selectLocation = (location: Location | null) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
    selectedLocation,
    isOpen,
    searchTerm,
    selectLocation,
    toggleOpen,
    setIsOpen,
    searchLocations,
    clearSearch,
    isLoading,
    error,
  };
}
