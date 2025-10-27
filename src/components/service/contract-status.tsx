"use client";

import * as React from "react";
import { Contract } from "@/core/domain/models/contract";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknoteIcon,
  QrCodeIcon,
  AlertCircleIcon,
} from "lucide-react";

interface ContractStatusProps {
  contract: Contract;
  className?: string;
}

const serviceStatusConfig = {
  not_started: {
    label: "Não iniciado",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: ClockIcon,
  },
  in_progress: {
    label: "Em andamento",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: ClockIcon,
  },
  completed: {
    label: "Concluído",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircleIcon,
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pagamento em aberto",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircleIcon,
  },
  paid: {
    label: "Pago",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircleIcon,
  },
  failed: {
    label: "Falha no pagamento",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircleIcon,
  },
  refunded: {
    label: "Reembolsado",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircleIcon,
  },
};

const paymentMethodConfig = {
  pix: {
    label: "PIX",
    icon: QrCodeIcon,
    color: "text-green-600",
  },
  credit_card: {
    label: "Cartão de Crédito",
    icon: CreditCardIcon,
    color: "text-blue-600",
  },
  debit_card: {
    label: "Cartão de Débito",
    icon: CreditCardIcon,
    color: "text-purple-600",
  },
  cash: {
    label: "Dinheiro",
    icon: BanknoteIcon,
    color: "text-orange-600",
  },
};

export function ContractStatus({ contract, className }: ContractStatusProps) {
  const serviceStatus = serviceStatusConfig[contract.serviceStatus];
  const paymentStatus = paymentStatusConfig[contract.paymentStatus];
  const paymentMethod = paymentMethodConfig[contract.paymentMethod];

  const ServiceIcon = serviceStatus.icon;
  const PaymentIcon = paymentStatus.icon;
  const MethodIcon = paymentMethod.icon;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Status do Contrato</h3>
        <p className="text-sm text-muted-foreground">
          Acompanhe o andamento do seu serviço
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Status */}
        <div className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ServiceIcon className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium">Status do Serviço</h4>
          </div>
          <Badge className={cn("w-fit", serviceStatus.color)}>
            {serviceStatus.label}
          </Badge>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <PaymentIcon className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium">Status do Pagamento</h4>
          </div>
          <Badge className={cn("w-fit", paymentStatus.color)}>
            {paymentStatus.label}
          </Badge>
        </div>
      </div>

      {/* Contract Details */}
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
            <p className="font-semibold text-green-600">
              R$ {contract.totalAmount.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <MethodIcon className={cn("w-4 h-4", paymentMethod.color)} />
          <span className="text-sm text-muted-foreground">
            Forma de Pagamento:
          </span>
          <span className="text-sm font-medium">{paymentMethod.label}</span>
        </div>

        {/* Notes */}
        {contract.notes && (
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">Observações:</span>
            <p className="text-sm mt-1">{contract.notes}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
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
        </div>
      </div>
    </div>
  );
}
