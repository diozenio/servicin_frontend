import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { services } from "@/container";
import { Service } from "@/core/domain/models/service";
import { ServiceListResponse } from "@/core/domain/models/service";

export function useServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const {
    data: allServicesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => services.serviceService.findAll(),
  });

  const allServices = allServicesResponse?.data || [];

  const { data: filteredServicesResponse, isLoading: isSearching } =
    useQuery<ServiceListResponse>({
      queryKey: ["services", "search", searchTerm, selectedLocation],
      queryFn: (): Promise<ServiceListResponse> =>
        services.serviceService.findAll({
          search: searchTerm || undefined,
          location: selectedLocation || undefined,
        }),
      enabled: searchTerm.length > 0 || selectedLocation !== null,
    });

  const filteredServices: Service[] = filteredServicesResponse?.data || [];

  const displayServices =
    searchTerm.length > 0 || selectedLocation !== null
      ? filteredServices
      : allServices;

  const searchServicesHandler = (term: string) => {
    setSearchTerm(term);
  };

  const filterByLocation = (location: string | null) => {
    setSelectedLocation(location);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation(null);
  };

  return {
    services: displayServices,
    allServices,
    searchTerm,
    selectedLocation,
    searchServices: searchServicesHandler,
    filterByLocation,
    clearFilters,
    isLoading: isLoading || isSearching,
    error,
  };
}
