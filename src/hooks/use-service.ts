import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import { Service, CreateServicePayload } from "@/core/domain/models/service";

export function useService(serviceId: string | null) {
  const {
    data: service,
    isLoading,
    error,
  } = useQuery<Service | null>({
    queryKey: ["service", serviceId],
    queryFn: async (): Promise<Service | null> => {
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
