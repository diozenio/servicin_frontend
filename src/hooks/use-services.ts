import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { container } from "@/container";
import { Service, ServiceListResponse } from "@/core/domain/models/service";
import { usePagination } from "./use-pagination";

interface UseServicesOptions {
  searchTerm?: string;
  selectedLocation?: string;
  providerId?: string;
  limit?: number;
}

export function useServices(options: UseServicesOptions = {}) {
  const {
    searchTerm = "",
    selectedLocation = "",
    providerId,
    limit: initialLimit,
  } = options;

  const { limit, offset, loadMore, reset } = usePagination({
    initialLimit: initialLimit || 12,
  });

  const [accumulatedServices, setAccumulatedServices] = useState<Service[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<ServiceListResponse>({
    queryKey: [
      "services",
      "search",
      searchTerm,
      selectedLocation,
      providerId,
      limit,
      offset,
    ],
    queryFn: (): Promise<ServiceListResponse> =>
      container.serviceService.findAll({
        search: searchTerm || undefined,
        location: selectedLocation || undefined,
        providerId: providerId || undefined,
        limit,
        offset,
      }),
  });

  useEffect(() => {
    setAccumulatedServices([]);
    setIsFirstLoad(true);
    reset();
  }, [searchTerm, selectedLocation, providerId, reset]);

  useEffect(() => {
    if (isFirstLoad && servicesResponse?.data !== undefined) {
      const currentServices: Service[] = servicesResponse.data || [];
      setAccumulatedServices(currentServices);
      setIsFirstLoad(false);
    } else if (!isFirstLoad && servicesResponse?.data) {
      const currentServices: Service[] = servicesResponse.data;
      if (currentServices.length > 0) {
        setAccumulatedServices((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newServices = currentServices.filter(
            (s) => !existingIds.has(s.id)
          );
          return [...prev, ...newServices];
        });
      }
    }
  }, [servicesResponse?.data, isFirstLoad]);

  const services = accumulatedServices;
  const total = servicesResponse?.total || 0;
  const hasMore = accumulatedServices.length < total;

  const fetch = (newSearchTerm: string, newLocation: string) => {
    return container.serviceService.findAll({
      search: newSearchTerm || undefined,
      location: newLocation || undefined,
      limit,
      offset,
    });
  };

  return {
    services,
    isFetching,
    isLoading,
    error,
    fetch,
    refetch,
    loadMore,
    limit,
    offset,
    total,
    hasMore,
  };
}
