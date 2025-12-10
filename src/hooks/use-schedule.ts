"use client";

import { useQuery } from "@tanstack/react-query";
import { ProviderSchedule } from "@/core/domain/models/schedule";

export function useSchedule(providerId: string, serviceId: string) {
  return useQuery({
    queryKey: ["schedule", providerId, serviceId],
    queryFn: async (): Promise<ProviderSchedule | null> => {
      return null;
    },
    enabled: !!providerId && !!serviceId,
  });
}
