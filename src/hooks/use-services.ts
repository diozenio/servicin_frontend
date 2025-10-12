import { useQuery } from "@tanstack/react-query";
import { container } from "@/container";
import { Service } from "@/core/domain/models/service";
import { ServiceListResponse } from "@/core/domain/models/service";

export function useServices(
  searchTerm: string = "",
  selectedLocation: string = ""
) {
  const {
    data: servicesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ServiceListResponse>({
    queryKey: ["services", "search", searchTerm, selectedLocation],
    queryFn: (): Promise<ServiceListResponse> =>
      container.serviceService.findAll({
        search: searchTerm || undefined,
        location: selectedLocation || undefined,
      }),
  });

  const services: Service[] = servicesResponse?.data || [];

  const fetch = (newSearchTerm: string, newLocation: string) => {
    return container.serviceService.findAll({
      search: newSearchTerm || undefined,
      location: newLocation || undefined,
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
