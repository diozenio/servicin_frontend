"use client";

import * as React from "react";
import { Appointment } from "@/core/domain/models/appointment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  XIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from "lucide-react";
import { useConfirmPayment } from "@/hooks/use-appointment";
import { useAuth } from "@/hooks/use-auth";

interface AppointmentActionsProps {
  appointment: Appointment;
  onCancel?: (appointment: Appointment) => void;
  onApprove?: (appointment: Appointment) => void;
  onReject?: (appointment: Appointment) => void;
  className?: string;
  isProvider?: boolean;
}

export function AppointmentActions({
  appointment,
  onCancel,
  onApprove,
  onReject,
  className,
}: AppointmentActionsProps) {
  const confirmPaymentMutation = useConfirmPayment();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const isCustomerForAppointment = appointment.client?.id === currentUserId;
  const isProviderForAppointment =
    appointment.service.provider?.userId === currentUserId;

  const isCashPayment = appointment.paymentMethod === "CASH";

  const canPay =
    isCustomerForAppointment &&
    appointment.paymentStatus !== "PAID" &&
    appointment.status !== "CANCELED" &&
    appointment.status !== "REJECTED" &&
    appointment.status !== "COMPLETED";

  let canCancel = false;
  if (isProviderForAppointment) {
    canCancel = appointment.status === "APPROVED";
  } else {
    canCancel =
      appointment.status === "PENDING" || appointment.status === "APPROVED";
  }

  const canApproveOrReject =
    isProviderForAppointment && appointment.status === "PENDING";

  const canConfirmCash =
    isProviderForAppointment &&
    isCashPayment &&
    appointment.status === "APPROVED" &&
    appointment.paymentStatus === "PENDING";

  const handlePay = async () => {
    try {
      await confirmPaymentMutation.mutateAsync(appointment.id);
    } catch {}
  };

  if (!canPay && !canCancel && !canApproveOrReject && !canConfirmCash) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2 pt-2 border-t", className)}>
      {canPay && (
        <Button
          variant="default"
          size="sm"
          onClick={handlePay}
          disabled={confirmPaymentMutation.isPending}
          className="flex-1"
        >
          <CreditCardIcon className="w-4 h-4 mr-2" />
          {confirmPaymentMutation.isPending ? "Processando..." : "Pagar agora"}
        </Button>
      )}

      {canConfirmCash && (
        <Button
          variant="default"
          size="sm"
          onClick={handlePay}
          disabled={confirmPaymentMutation.isPending}
          className="flex-1"
        >
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          {confirmPaymentMutation.isPending
            ? "Confirmando..."
            : "Confirmar pagamento"}
        </Button>
      )}

      {canCancel && onCancel && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onCancel(appointment)}
          className="flex-1"
        >
          <XIcon className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      )}

      {canApproveOrReject && (
        <>
          {onReject && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(appointment)}
              className="flex-1"
            >
              <ThumbsDownIcon className="w-4 h-4 mr-2" />
              Recusar
            </Button>
          )}
          {onApprove && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(appointment)}
              className="flex-1"
            >
              <ThumbsUpIcon className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
          )}
        </>
      )}
    </div>
  );
}
