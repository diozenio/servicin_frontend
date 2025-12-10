"use client";

import * as React from "react";
import { PaymentMethod } from "@/core/domain/models/appointment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCardIcon, BanknoteIcon, QrCodeIcon } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
  className?: string;
}

const paymentMethods = [
  {
    id: "PIX" as PaymentMethod,
    name: "PIX",
    description: "Pagamento instantâneo",
    icon: QrCodeIcon,
  },
  {
    id: "CREDIT_CARD" as PaymentMethod,
    name: "Cartão de Crédito",
    description: "Visa, Mastercard, etc.",
    icon: CreditCardIcon,
  },
  {
    id: "DEBIT_CARD" as PaymentMethod,
    name: "Cartão de Débito",
    description: "Débito direto na conta",
    icon: CreditCardIcon,
  },
  {
    id: "CASH" as PaymentMethod,
    name: "Dinheiro",
    description: "Pagamento em espécie",
    icon: BanknoteIcon,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodSelect,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Forma de Pagamento</h3>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja pagar pelo serviço
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <Button
              key={method.id}
              variant="outline"
              className={cn(
                "h-auto p-4 flex flex-col items-center gap-2 text-center",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => onMethodSelect(method.id)}
            >
              <Icon className="w-6 h-6" />
              <div className="space-y-1 text-center">
                <div className="font-medium text-sm">{method.name}</div>
                <div className="text-xs text-muted-foreground">
                  {method.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
