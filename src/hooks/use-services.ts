import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { container } from "@/container";
import {
  Service,
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";
import { usePagination } from "./use-pagination";
import { ServiceFilters } from "@/core/domain/models/filters";

interface UseServicesOptions {
  searchTerm?: string;
  selectedLocation?: string;
  providerId?: string;
  limit?: number;
  filters?: ServiceFilters;
}

export function useServices(options: UseServicesOptions = {}) {
  const {
    searchTerm = "",
    selectedLocation = "",
    providerId,
    limit: initialLimit,
    filters,
  } = options;

  const { limit, offset, loadMore, reset } = usePagination({
    initialLimit: initialLimit || filters?.pageSize || 12,
  });

  const [accumulatedServices, setAccumulatedServices] = useState<Service[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const queryParams: ServiceQueryParams = {
    page: filters?.page || 1,
    pageSize: filters?.pageSize || limit,
    q: filters?.q || searchTerm || undefined,
    providerName: filters?.providerName,
    category: filters?.category,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    minRating: filters?.minRating,
    stateId: filters?.stateId,
    cityId: filters?.cityId,
  };

  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<ServiceListResponse>({
    queryKey: ["services", "search", queryParams],
    queryFn: (): Promise<ServiceListResponse> =>
      container.serviceService.findAll(queryParams),
  });

  useEffect(() => {
    setAccumulatedServices([]);
    setIsFirstLoad(true);
    reset();
  }, [searchTerm, selectedLocation, providerId, filters, reset]);

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

  const fetch = (
    newSearchTerm: string,
    newStateId: string,
    newCityId: string
  ) => {
    return container.serviceService.findAll({
      q: newSearchTerm || undefined,
      stateId: newStateId || undefined,
      cityId: newCityId || undefined,
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
