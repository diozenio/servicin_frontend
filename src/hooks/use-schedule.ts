import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingRequest } from "@/core/domain/models/schedule";
import { container } from "@/container";

export function useSchedule(providerId: string, serviceId: string) {
  return useQuery({
    queryKey: ["schedule", providerId, serviceId],
    queryFn: () =>
      container.scheduleService.getProviderSchedule(providerId, serviceId),
    enabled: !!providerId && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) =>
      container.scheduleService.createBooking(booking),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["schedule", variables.providerId, variables.serviceId],
      });
    },
  });
}

export function useCheckAvailability() {
  return useMutation({
    mutationFn: ({
      providerId,
      serviceId,
      date,
      timeSlot,
    }: {
      providerId: string;
      serviceId: string;
      date: string;
      timeSlot: string;
    }) =>
      container.scheduleService.checkAvailability(
        providerId,
        serviceId,
        date,
        timeSlot
      ),
  });
}
