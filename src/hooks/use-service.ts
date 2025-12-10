import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import {
  Service,
  CreateServicePayload,
  ServiceResponse,
} from "@/core/domain/models/service";

export function useService(serviceId: string | null) {
  const {
    data: service,
    isLoading,
    error,
  } = useQuery<ServiceResponse | null>({
    queryKey: ["service", serviceId],
    queryFn: async (): Promise<ServiceResponse | null> => {
      if (!serviceId) return null;

      const response = await container.serviceService.findById(serviceId);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Service not found");
      }

      return response.data;
    },
    enabled: !!serviceId,
  });

  return {
    service,
    isLoading,
    error,
  };
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      return container.serviceService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
