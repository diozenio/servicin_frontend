"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import { Appointment } from "@/core/domain/models/appointment";

export function useAppointments(userId: string) {
  return useQuery({
    queryKey: ["appointments", userId],
    queryFn: async () => {
      const response = await container.appointmentService.fetchAppointmentsForUser(userId);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useAppointmentDetails(appointmentId: string) {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      if (!appointmentId || appointmentId === "undefined") return null;
      const response = await container.appointmentService.fetchAppointmentById(appointmentId);
      return response.data;
    },
    enabled: !!appointmentId && appointmentId !== "undefined",
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Appointment>) => {
      return container.appointmentService.createAppointment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Appointment["status"] }) => {
      return container.appointmentService.updateAppointmentStatus(id, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return container.appointmentService.cancelAppointment(id, reason);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
    },
  });
}