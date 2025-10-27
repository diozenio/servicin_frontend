"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BanknoteIcon, CheckIcon, ClockIcon } from "lucide-react";

interface CashPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
  className?: string;
}

export function CashPayment({
  amount,
  onPaymentConfirmed,
  className,
}: CashPaymentProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onPaymentConfirmed();
    }, 1000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BanknoteIcon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Pagamento em Dinheiro</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          O pagamento será realizado no local do serviço
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <BanknoteIcon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold">
              R$ {amount.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-muted-foreground">
              Valor a ser pago em espécie
            </p>
          </div>
        </div>

        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Instruções para Pagamento
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Leve o valor exato em dinheiro</li>
                <li>• O pagamento deve ser feito no início do serviço</li>
                <li>• Peça o recibo após o pagamento</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Status do Serviço
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Não iniciado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Pagamento em aberto</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isConfirmed}
          className="w-full"
          size="lg"
        >
          {isConfirmed ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Contratação Confirmada!
            </>
          ) : (
            "Confirmar Contratação"
          )}
        </Button>
      </div>
    </div>
  );
}
