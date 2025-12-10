"use client";

import { useState } from "react";
import { Appointment } from "@/core/domain/models/appointment";
import { AppointmentCard } from "./appointment-card";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { AppointmentActions } from "./appointment-actions";
import { CancelServiceDialog } from "./cancel-service-dialog";
import { ApproveAppointmentDialog } from "./approve-appointment-dialog";
import {
  useCancelAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointment";

interface AppointmentListProps {
  appointments: Appointment[];
  onViewAppointment?: (appointment: Appointment) => void;
  className?: string;
}

export function AppointmentList({
  appointments,
  onViewAppointment,
  className,
}: AppointmentListProps) {
  const [cancelingAppointment, setCancelingAppointment] =
    useState<Appointment | null>(null);
  const [approvingAppointment, setApprovingAppointment] =
    useState<Appointment | null>(null);

  const cancelAppointmentMutation = useCancelAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleCancelAppointment = (appointment: Appointment) => {
    setCancelingAppointment(appointment);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!cancelingAppointment) return;

    try {
      await cancelAppointmentMutation.mutateAsync({
        appointmentId: cancelingAppointment.id,
        reason,
      });
      setCancelingAppointment(null);
    } catch {}
  };

  const handleApproveAppointment = (appointment: Appointment) => {
    setApprovingAppointment(appointment);
  };

  const handleApproveConfirm = async () => {
    if (!approvingAppointment) return;

    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: approvingAppointment.id,
        status: "APPROVED",
      });
      setApprovingAppointment(null);
    } catch {}
  };

  const handleRejectConfirm = async () => {
    if (!approvingAppointment) return;

    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: approvingAppointment.id,
        status: "REJECTED",
      });
      setApprovingAppointment(null);
    } catch {}
  };

  if (appointments.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhum agendamento encontrado
        </h3>
        <p className="text-sm text-muted-foreground">
          Você ainda não possui agendamentos de serviços.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">Meus Agendamentos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {appointments.length} agendamento
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => {
          return (
            <div key={appointment.id} className="space-y-3">
              <AppointmentCard
                appointment={appointment}
                onView={onViewAppointment}
              />
              <AppointmentActions
                appointment={appointment}
                onCancel={handleCancelAppointment}
                onApprove={handleApproveAppointment}
                onReject={handleApproveAppointment}
              />
            </div>
          );
        })}
      </div>

      {cancelingAppointment && (
        <CancelServiceDialog
          isOpen={!!cancelingAppointment}
          onClose={() => setCancelingAppointment(null)}
          onConfirm={handleCancelConfirm}
          isLoading={cancelAppointmentMutation.isPending}
        />
      )}

      {approvingAppointment && (
        <ApproveAppointmentDialog
          isOpen={!!approvingAppointment}
          onClose={() => setApprovingAppointment(null)}
          onApprove={handleApproveConfirm}
          onReject={handleRejectConfirm}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
}
