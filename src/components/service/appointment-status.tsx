"use client";

import * as React from "react";
import { useState } from "react";
import { Appointment } from "@/core/domain/models/appointment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknoteIcon,
  QrCodeIcon,
  AlertCircleIcon,
  XIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import { CancelServiceDialog } from "./cancel-service-dialog";
import { ApproveAppointmentDialog } from "./approve-appointment-dialog";
import {
  useCancelAppointment,
  useUpdateAppointmentStatus,
  useCompleteService,
} from "@/hooks/use-appointment";
import { useAuth } from "@/hooks/use-auth";

interface AppointmentStatusProps {
  appointment: Appointment;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: "Pendente",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    icon: ClockIcon,
  },
  APPROVED: {
    label: "Aprovado",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    icon: CheckCircleIcon,
  },
  REJECTED: {
    label: "Recusado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircleIcon,
  },
  CANCELED: {
    label: "Cancelado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircleIcon,
  },
  COMPLETED: {
    label: "Concluído",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    icon: CheckCircleIcon,
  },
};

const paymentStatusConfig = {
  PENDING: {
    label: "Pagamento pendente",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
    icon: AlertCircleIcon,
  },
  PAID: {
    label: "Pago",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    icon: CheckCircleIcon,
  },
  FAILED: {
    label: "Falha no pagamento",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircleIcon,
  },
  REFUNDED: {
    label: "Reembolsado",
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
    icon: XCircleIcon,
  },
};

const paymentMethodConfig = {
  PIX: {
    label: "PIX",
    icon: QrCodeIcon,
    color: "text-green-600 dark:text-green-400",
  },
  CREDIT_CARD: {
    label: "Cartão de Crédito",
    icon: CreditCardIcon,
    color: "text-blue-600 dark:text-blue-400",
  },
  DEBIT_CARD: {
    label: "Cartão de Débito",
    icon: CreditCardIcon,
    color: "text-purple-600 dark:text-purple-400",
  },
  CASH: {
    label: "Dinheiro",
    icon: BanknoteIcon,
    color: "text-orange-600 dark:text-orange-400",
  },
};

export function AppointmentStatus({
  appointment,
  className,
}: AppointmentStatusProps) {
  const { user } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const cancelAppointmentMutation = useCancelAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const completeServiceMutation = useCompleteService();

  const status = statusConfig[appointment.status];
  const paymentStatus = paymentStatusConfig[appointment.paymentStatus];
  const paymentMethod = paymentMethodConfig[appointment.paymentMethod];

  const StatusIcon = status.icon;
  const PaymentIcon = paymentStatus.icon;
  const MethodIcon = paymentMethod.icon;

  const isProvider = appointment.service.provider?.userId === user?.id;
  const canCancel =
    (appointment.status === "PENDING" || appointment.status === "APPROVED") &&
    !isProvider;
  const canApproveOrReject =
    isProvider &&
    appointment.paymentStatus === "PAID" &&
    appointment.status === "PENDING";
  const canComplete =
    isProvider &&
    appointment.status === "APPROVED" &&
    appointment.paymentStatus === "PAID";

  const startDate = new Date(appointment.scheduledStartTime);
  const endDate = new Date(appointment.scheduledEndTime);

  const handleCancelConfirm = async (reason: string) => {
    try {
      await cancelAppointmentMutation.mutateAsync({
        appointmentId: appointment.id,
        reason,
      });
      setShowCancelDialog(false);
    } catch {}
  };

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: appointment.id,
        status: "APPROVED",
      });
      setShowApproveDialog(false);
    } catch {}
  };

  const handleReject = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: appointment.id,
        status: "REJECTED",
      });
      setShowApproveDialog(false);
    } catch {}
  };

  const handleComplete = async () => {
    try {
      await completeServiceMutation.mutateAsync(appointment.id);
    } catch {}
  };

  return (
    <div
      className={cn("space-y-4", className)}
      role="region"
      aria-label="Status do agendamento"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Status do Agendamento</h3>
        <p className="text-sm text-muted-foreground">
          Acompanhe o andamento do seu serviço
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-medium">Status do Agendamento</h4>
          </div>
          <Badge className={cn("w-fit", status.color)}>{status.label}</Badge>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <PaymentIcon className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-medium">Status do Pagamento</h4>
          </div>
          <Badge className={cn("w-fit", paymentStatus.color)}>
            {paymentStatus.label}
          </Badge>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MethodIcon className={cn("w-5 h-5", paymentMethod.color)} />
            <h4 className="font-medium">Forma de Pagamento</h4>
          </div>
          <p className="text-sm font-medium">{paymentMethod.label}</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium">Detalhes do Agendamento</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID do Agendamento:</span>
            <p className="font-mono text-xs">{appointment.id}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Serviço:</span>
            <p className="font-medium">{appointment.service.name}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Data de Início:</span>
            <p>{startDate.toLocaleDateString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">
              {startDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground">Data de Término:</span>
            <p>{endDate.toLocaleDateString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">
              {endDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {appointment.client && (
            <>
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p>
                  {appointment.client.individual?.fullName ||
                    appointment.client.company?.corporateName ||
                    "N/A"}
                </p>
              </div>
              {appointment.client.contacts.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Contato:</span>
                  <p>{appointment.client.contacts[0].value}</p>
                </div>
              )}
            </>
          )}

          <div>
            <span className="text-muted-foreground">Valor Total:</span>
            <p className="font-semibold text-green-600 dark:text-green-400">
              R$ {appointment.price.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {appointment.description && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">Descrição:</span>
            <p className="text-sm mt-1">{appointment.description}</p>
          </div>
        )}

        {appointment.cancellationReason && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              Motivo do Cancelamento:
            </span>
            <p className="text-sm mt-1 text-destructive">
              {appointment.cancellationReason}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cancelado em{" "}
              {new Date(appointment.updatedAt).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Histórico</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">
              Agendamento criado em{" "}
              {new Date(appointment.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>

          {appointment.paymentStatus === "PAID" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Pagamento confirmado em{" "}
                {new Date(appointment.updatedAt).toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          {appointment.status === "APPROVED" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Agendamento aprovado pelo provedor
              </span>
            </div>
          )}

          {appointment.status === "REJECTED" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Agendamento recusado pelo provedor
                {appointment.paymentStatus === "REFUNDED" &&
                  " (reembolso realizado)"}
              </span>
            </div>
          )}

          {appointment.status === "COMPLETED" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Serviço concluído</span>
            </div>
          )}

          {appointment.status === "CANCELED" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Agendamento cancelado em{" "}
                {new Date(appointment.updatedAt).toLocaleString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            className="w-full"
          >
            <XIcon className="w-4 h-4 mr-2" />
            Cancelar Agendamento
          </Button>
        )}

        {canApproveOrReject && (
          <Button
            variant="default"
            onClick={() => setShowApproveDialog(true)}
            className="w-full"
          >
            <ThumbsUpIcon className="w-4 h-4 mr-2" />
            Aprovar ou Recusar
          </Button>
        )}

        {canComplete && (
          <Button
            variant="default"
            onClick={handleComplete}
            disabled={completeServiceMutation.isPending}
            className="w-full"
          >
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            {completeServiceMutation.isPending
              ? "Completando..."
              : "Completar Serviço"}
          </Button>
        )}
      </div>

      <CancelServiceDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelAppointmentMutation.isPending}
      />

      <ApproveAppointmentDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={
          updateStatusMutation.isPending || completeServiceMutation.isPending
        }
      />
    </div>
  );
}
