"use client";

import * as React from "react";
import Link from "next/link";
import { Appointment } from "@/core/domain/models/appointment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  EyeIcon,
  StarIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AppointmentCardProps {
  appointment: Appointment;
  onView?: (appointment: Appointment) => void;
  className?: string;
  isServiceProvider?: boolean;
}

const statusConfig = {
  PENDING: {
    label: "Pendente",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  },
  APPROVED: {
    label: "Aprovado",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  },
  REJECTED: {
    label: "Recusado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  },
  CANCELED: {
    label: "Cancelado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  },
  COMPLETED: {
    label: "Concluído",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  },
};

const paymentStatusConfig = {
  PENDING: {
    label: "Pagamento pendente",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  },
  PAID: {
    label: "Pago",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  },
  FAILED: {
    label: "Falha no pagamento",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  },
  REFUNDED: {
    label: "Reembolsado",
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
  },
};

export function AppointmentCard({
  appointment,
  onView,
  className,
}: AppointmentCardProps) {
  const { user } = useAuth();
  const status = statusConfig[appointment.status];
  const paymentStatus = paymentStatusConfig[appointment.paymentStatus];

  const startDate = new Date(appointment.scheduledStartTime);
  const endDate = new Date(appointment.scheduledEndTime);

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const isCustomerForAppointment = appointment.client?.id === user?.id;

  console.log(appointment);

  const start = formatDateTime(startDate);
  const canReview =
    isCustomerForAppointment &&
    appointment.status === "COMPLETED" &&
    appointment.paymentStatus === "PAID";

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 space-y-3 hover:shadow-sm transition-shadow",
        className
      )}
      aria-label={`Agendamento para ${appointment.service.name} em ${start.date}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{appointment.service.name}</h3>
          <p className="text-sm text-muted-foreground">
            {start.date} às {start.time}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
          <Badge className={cn("text-xs", paymentStatus.color)}>
            {paymentStatus.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          <span>{start.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="w-4 h-4" />
          <span>
            {start.time} - {formatDateTime(endDate).time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSignIcon className="w-4 h-4" />
          <span className="font-medium text-green-600 dark:text-green-400">
            R$ {appointment.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {appointment.cancellationReason && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm font-medium text-destructive">
            Motivo do Cancelamento:
          </p>
          <p className="text-sm text-destructive/80 mt-1">
            {appointment.cancellationReason}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(appointment)}
            className="flex-1"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        )}
        {canReview && (
          <Link
            href={`/appointments/${appointment.id}/review`}
            className="flex-1"
          >
            <Button variant="default" size="sm" className="w-full">
              <StarIcon className="w-4 h-4 mr-2" />
              Deixar Avaliação
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
