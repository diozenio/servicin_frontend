"use client";

import * as React from "react";
import { useState } from "react";
import { Contract } from "@/core/domain/models/contract";
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
import { useCancelContract } from "@/hooks/use-contract";
import { ScheduleService } from "@/core/services/ScheduleService";
import { ScheduleMock } from "@/infra/schedule/ScheduleMock";

interface ContractStatusProps {
  contract: Contract;
  className?: string;
}

const serviceStatusConfig = {
  not_started: {
    label: "Não iniciado",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    icon: ClockIcon,
  },
  in_progress: {
    label: "Em andamento",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    icon: ClockIcon,
  },
  completed: {
    label: "Concluído",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: "Cancelado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircleIcon,
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pagamento em aberto",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
    icon: AlertCircleIcon,
  },
  paid: {
    label: "Pago",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    icon: CheckCircleIcon,
  },
  failed: {
    label: "Falha no pagamento",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: XCircleIcon,
  },
  refunded: {
    label: "Reembolsado",
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
    icon: XCircleIcon,
  },
};

const paymentMethodConfig = {
  pix: {
    label: "PIX",
    icon: QrCodeIcon,
    color: "text-green-600 dark:text-green-400",
  },
  credit_card: {
    label: "Cartão de Crédito",
    icon: CreditCardIcon,
    color: "text-blue-600 dark:text-blue-400",
  },
  debit_card: {
    label: "Cartão de Débito",
    icon: CreditCardIcon,
    color: "text-purple-600 dark:text-purple-400",
  },
  cash: {
    label: "Dinheiro",
    icon: BanknoteIcon,
    color: "text-orange-600 dark:text-orange-400",
  },
};

const approvalStatusConfig = {
  pending: {
    label: "Aguardando Aprovação",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    icon: ClockIcon,
  },
  approved: {
    label: "Aprovado",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    icon: ThumbsUpIcon,
  },
  rejected: {
    label: "Recusado",
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: ThumbsDownIcon,
  },
};

export function ContractStatus({ contract, className }: ContractStatusProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const cancelContractMutation = useCancelContract();
  const scheduleService = new ScheduleService(new ScheduleMock());

  const serviceStatus = serviceStatusConfig[contract.serviceStatus];
  const paymentStatus = paymentStatusConfig[contract.paymentStatus];
  const approvalStatus = approvalStatusConfig[contract.approvalStatus];
  const paymentMethod = paymentMethodConfig[contract.paymentMethod];

  const ServiceIcon = serviceStatus.icon;
  const PaymentIcon = paymentStatus.icon;
  const ApprovalIcon = approvalStatus.icon;
  const MethodIcon = paymentMethod.icon;

  const canCancel = contract.serviceStatus === "not_started";

  const handleCancelConfirm = async (reason: string) => {
    try {
      const success = await cancelContractMutation.mutateAsync({
        contractId: contract.id,
        reason,
      });

      if (success) {
        await scheduleService.releaseTimeSlot(
          contract.providerId,
          contract.serviceId,
          contract.date,
          contract.timeSlot
        );

        setShowCancelDialog(false);
      }
    } catch {
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Status do Contrato</h3>
        <p className="text-sm text-muted-foreground">
          Acompanhe o andamento do seu serviço
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ServiceIcon className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-medium">Status do Serviço</h4>
          </div>
          <Badge className={cn("w-fit", serviceStatus.color)}>
            {serviceStatus.label}
          </Badge>
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
            <ApprovalIcon className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-medium">Status de Aprovação</h4>
          </div>
          <Badge className={cn("w-fit", approvalStatus.color)}>
            {approvalStatus.label}
          </Badge>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium">Detalhes do Contrato</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID do Contrato:</span>
            <p className="font-mono text-xs">{contract.id}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Data do Serviço:</span>
            <p>{new Date(contract.date).toLocaleDateString("pt-BR")}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Horário:</span>
            <p>{contract.timeSlot}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Cliente:</span>
            <p>{contract.customerName}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Telefone:</span>
            <p>{contract.customerPhone}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Valor Total:</span>
            <p className="font-semibold text-green-600 dark:text-green-400">
              R$ {contract.totalAmount.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <MethodIcon className={cn("w-4 h-4", paymentMethod.color)} />
          <span className="text-sm text-muted-foreground">
            Forma de Pagamento:
          </span>
          <span className="text-sm font-medium">{paymentMethod.label}</span>
        </div>

        {contract.notes && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">Observações:</span>
            <p className="text-sm mt-1">{contract.notes}</p>
          </div>
        )}

        {contract.serviceStatus === "cancelled" &&
          contract.cancellationReason && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Motivo do Cancelamento:
              </span>
              <p className="text-sm mt-1 text-destructive">
                {contract.cancellationReason}
              </p>
              {contract.cancelledAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Cancelado em{" "}
                  {new Date(contract.cancelledAt).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Histórico</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">
              Contrato criado em{" "}
              {new Date(contract.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>

          {contract.paymentStatus === "paid" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Pagamento confirmado em{" "}
                {new Date(contract.updatedAt).toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          {contract.approvalStatus === "approved" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Contrato aprovado pelo provedor
              </span>
            </div>
          )}

          {contract.approvalStatus === "rejected" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Contrato recusado pelo provedor
                {contract.paymentStatus === "refunded" && " (reembolso realizado)"}
              </span>
            </div>
          )}

          {contract.serviceStatus === "in_progress" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Serviço iniciado</span>
            </div>
          )}

          {contract.serviceStatus === "completed" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Serviço concluído</span>
            </div>
          )}

          {contract.serviceStatus === "cancelled" && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Serviço cancelado em{" "}
                {contract.cancelledAt &&
                  new Date(contract.cancelledAt).toLocaleString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      </div>

      {canCancel && (
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            className="w-full"
          >
            <XIcon className="w-4 h-4 mr-2" />
            Cancelar Serviço
          </Button>
        </div>
      )}

      <CancelServiceDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelContractMutation.isPending}
      />
    </div>
  );
}
