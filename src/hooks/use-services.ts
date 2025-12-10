import { useQuery } from "@tanstack/react-query";
import { container } from "@/container";
import {
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";

export function useServices(params: ServiceQueryParams) {
  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<ServiceListResponse>({
    queryKey: ["services", "search", params],
    queryFn: async (): Promise<ServiceListResponse> => {
      const { data } = await container.serviceService.findAll(params);
      return data;
    },
  });

  const services = servicesResponse?.data || [];
  const page = servicesResponse?.page || 1;
  const pageSize = servicesResponse?.pageSize || 12;
  const total = servicesResponse?.total || 0;
  const totalPages = servicesResponse?.totalPages || 0;
  const currentPage = servicesResponse?.page || 1;

  return {
    services,
    isFetching,
    isLoading,
    error,
    refetch,
    page,
    pageSize,
    currentPage,
    total,
    totalPages,
  };
}
