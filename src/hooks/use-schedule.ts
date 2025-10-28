import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleService } from "@/core/services/ScheduleService";
import { ScheduleMock } from "@/infra/schedule/ScheduleMock";
import { BookingRequest } from "@/core/domain/models/schedule";

const scheduleService = new ScheduleService(new ScheduleMock());

export function useSchedule(providerId: string, serviceId: string) {
  return useQuery({
    queryKey: ["schedule", providerId, serviceId],
    queryFn: () => scheduleService.getProviderSchedule(providerId, serviceId),
    enabled: !!providerId && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) =>
      scheduleService.createBooking(booking),
    onSuccess: (data, variables) => {
      // Invalidate and refetch schedule data
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
      scheduleService.checkAvailability(providerId, serviceId, date, timeSlot),
  });
}
