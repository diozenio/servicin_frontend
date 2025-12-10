"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@/container";
import {
  Appointment,
  CreateAppointmentPayload,
} from "@/core/domain/models/appointment";

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response =
        await container.appointmentService.fetchAppointmentsForUser();
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useReceivedAppointments() {
  return useQuery({
    queryKey: ["appointments", "received"],
    queryFn: async () => {
      const response =
        await container.appointmentService.fetchReceivedAppointments();
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useAppointmentDetails(appointmentId: string) {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      if (!appointmentId || appointmentId === "undefined") return null;
      const response = await container.appointmentService.fetchAppointmentById(
        appointmentId
      );
      return response.data;
    },
    enabled: !!appointmentId && appointmentId !== "undefined",
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAppointmentPayload) => {
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
    mutationFn: async ({
      appointmentId,
      status,
      reason,
    }: {
      appointmentId: string;
      status: Appointment["status"];
      reason?: string;
    }) => {
      return container.appointmentService.updateAppointmentStatus(
        appointmentId,
        status,
        reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointmentId],
      });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      reason,
    }: {
      appointmentId: string;
      reason: string;
    }) => {
      return container.appointmentService.cancelAppointment(
        appointmentId,
        reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointmentId],
      });
    },
  });
}

export function useCompleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return container.appointmentService.completeService(appointmentId);
    },
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return container.appointmentService.confirmPayment(appointmentId);
    },
    onSuccess: (_, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
  });
}
