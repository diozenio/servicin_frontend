import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { container } from "@/container";
import { Service, ServiceListResponse } from "@/core/domain/models/service";
import { usePagination } from "./use-pagination";

interface UseServicesOptions {
  searchTerm?: string;
  selectedLocation?: string;
  limit?: number;
}

export function useServices(options: UseServicesOptions = {}) {
  const {
    searchTerm = "",
    selectedLocation = "",
    limit: initialLimit,
  } = options;

  // Pagination hook
  const { limit, offset, loadMore, reset } = usePagination({
    initialLimit: initialLimit || 12,
  });

  // State to accumulate services
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
      limit,
      offset,
    ],
    queryFn: (): Promise<ServiceListResponse> =>
      container.serviceService.findAll({
        search: searchTerm || undefined,
        location: selectedLocation || undefined,
        limit,
        offset,
      }),
    placeholderData: (previousData) => previousData,
  });

  const currentServices: Service[] = servicesResponse?.data || [];

  // Handle data accumulation
  useEffect(() => {
    if (isFirstLoad) {
      // First load or new search - replace all services
      setAccumulatedServices(currentServices);
      setIsFirstLoad(false);
    } else if (currentServices.length > 0) {
      // Loading more - append new services
      setAccumulatedServices((prev) => {
        // Avoid duplicates by checking if service already exists
        const existingIds = new Set(prev.map((s) => s.id));
        const newServices = currentServices.filter(
          (s) => !existingIds.has(s.id)
        );
        return [...prev, ...newServices];
      });
    }
  }, [currentServices, isFirstLoad, setAccumulatedServices, setIsFirstLoad]);

  // Reset accumulation when search parameters change
  useEffect(() => {
    setAccumulatedServices([]);
    setIsFirstLoad(true);
    reset();
  }, [searchTerm, selectedLocation, reset]);

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
