import { useQuery } from "@tanstack/react-query";
import { container } from "@/container";
import { Service } from "@/core/domain/models/service";
import { ServiceListResponse } from "@/core/domain/models/service";

interface UseServicesOptions {
  searchTerm?: string;
  selectedLocation?: string;
  limit?: number;
}

export function useServices(options: UseServicesOptions = {}) {
  const { searchTerm = "", selectedLocation = "", limit } = options;

  const {
    data: servicesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ServiceListResponse>({
    queryKey: ["services", "search", searchTerm, selectedLocation, limit],
    queryFn: (): Promise<ServiceListResponse> =>
      container.serviceService.findAll({
        search: searchTerm || undefined,
        location: selectedLocation || undefined,
        limit,
      }),
  });

  const services: Service[] = servicesResponse?.data || [];

  const fetch = (newSearchTerm: string, newLocation: string) => {
    return container.serviceService.findAll({
      search: newSearchTerm || undefined,
      location: newLocation || undefined,
      limit,
    });
  };

  return {
    services,
    isLoading,
    error,
    fetch,
    refetch,
  };
}
