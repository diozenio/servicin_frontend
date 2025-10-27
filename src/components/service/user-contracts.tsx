"use client";

import * as React from "react";
import { useState } from "react";
import { Contract } from "@/core/domain/models/contract";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  DollarSignIcon,
  XIcon,
  EyeIcon,
} from "lucide-react";
import { CancelServiceDialog } from "./cancel-service-dialog";
import { useCancelContract } from "@/hooks/use-contract";
import { ScheduleService } from "@/core/services/ScheduleService";
import { ScheduleMock } from "@/infra/schedule/ScheduleMock";

interface UserContractsProps {
  contracts: Contract[];
  onViewContract?: (contract: Contract) => void;
  className?: string;
}

const serviceStatusConfig = {
  not_started: {
    label: "Não iniciado",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  in_progress: {
    label: "Em andamento",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Concluído",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pagamento em aberto",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  paid: {
    label: "Pago",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  failed: {
    label: "Falha no pagamento",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  refunded: {
    label: "Reembolsado",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export function UserContracts({
  contracts,
  onViewContract,
  className,
}: UserContractsProps) {
  const [cancelingContract, setCancelingContract] = useState<Contract | null>(
    null
  );
  const cancelContractMutation = useCancelContract();
  const scheduleService = new ScheduleService(new ScheduleMock());

  const handleCancelContract = (contract: Contract) => {
    setCancelingContract(contract);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!cancelingContract) return;

    try {
      const success = await cancelContractMutation.mutateAsync({
        contractId: cancelingContract.id,
        reason,
      });

      if (success) {
        await scheduleService.releaseTimeSlot(
          cancelingContract.providerId,
          cancelingContract.serviceId,
          cancelingContract.date,
          cancelingContract.timeSlot
        );

        setCancelingContract(null);
      }
    } catch (error) {
      console.error("Error canceling contract:", error);
    }
  };

  const canCancel = (contract: Contract) =>
    contract.serviceStatus === "not_started";

  if (contracts.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhum contrato encontrado
        </h3>
        <p className="text-sm text-muted-foreground">
          Você ainda não possui contratos de serviços.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Meus Contratos</h2>
        <span className="text-sm text-muted-foreground">
          {contracts.length} contrato{contracts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {contracts.map((contract) => {
          const serviceStatus = serviceStatusConfig[contract.serviceStatus];
          const paymentStatus = paymentStatusConfig[contract.paymentStatus];
          const canCancelContract = canCancel(contract);

          return (
            <div
              key={contract.id}
              className="bg-white rounded-lg border p-4 space-y-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">
                    Contrato #{contract.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(contract.date).toLocaleDateString("pt-BR")} às{" "}
                    {contract.timeSlot}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", serviceStatus.color)}>
                    {serviceStatus.label}
                  </Badge>
                  <Badge className={cn("text-xs", paymentStatus.color)}>
                    {paymentStatus.label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(contract.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ClockIcon className="w-4 h-4" />
                  <span>{contract.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSignIcon className="w-4 h-4" />
                  <span className="font-medium text-green-600">
                    R$ {contract.totalAmount.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              {contract.serviceStatus === "cancelled" &&
                contract.cancellationReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <XIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Motivo do Cancelamento:
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          {contract.cancellationReason}
                        </p>
                        {contract.cancelledAt && (
                          <p className="text-xs text-red-600 mt-1">
                            Cancelado em{" "}
                            {new Date(contract.cancelledAt).toLocaleString(
                              "pt-BR"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-2 pt-2 border-t">
                {onViewContract && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewContract(contract)}
                    className="flex-1"
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                )}
                {canCancelContract && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelContract(contract)}
                    className="flex-1"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cancelingContract && (
        <CancelServiceDialog
          isOpen={!!cancelingContract}
          onClose={() => setCancelingContract(null)}
          onConfirm={handleCancelConfirm}
          isLoading={cancelContractMutation.isPending}
          contractId={cancelingContract.id}
        />
      )}
    </div>
  );
}
