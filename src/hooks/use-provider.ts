import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import {
  CreateServiceProviderPayload,
  ServiceProviderByIdResponseData,
} from "@/core/domain/models/user";

export function useServiceProvider(providerId: string | null) {
  const {
    data: provider,
    isLoading,
    error,
  } = useQuery<ServiceProviderByIdResponseData | null>({
    queryKey: ["provider", providerId],
    queryFn: async (): Promise<ServiceProviderByIdResponseData | null> => {
      if (!providerId) return null;

      const response = await container.serviceProviderService.getById(
        providerId
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Provider not found");
      }

      return response.data;
    },
    enabled: !!providerId,
  });

  return {
    provider,
    isLoading,
    error,
  };
}

export function useUpdateServiceProviderSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        autoAcceptAppointments?: boolean;
        showContactInfo?: boolean;
      };
    }) => {
      const response = await container.serviceProviderService.updateSettings(
        id,
        payload
      );

      if (!response.success) {
        throw new Error(response.message || "Erro ao atualizar provedor");
      }

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provider", variables.id],
      });
    },
  });
}

export function useCreateServiceProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServiceProviderPayload) => {
      const response = await container.serviceProviderService.create(payload);

      if (!response.success) {
        throw new Error(response.message || "Erro ao criar provedor");
      }

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "user"],
        refetchType: "active",
      });
      await queryClient.refetchQueries({
        queryKey: ["auth", "user"],
      });
    },
  });
}
