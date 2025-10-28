"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QrCodeIcon, CopyIcon, CheckIcon, SmartphoneIcon } from "lucide-react";

interface PixPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
  className?: string;
}

export function PixPayment({
  amount,
  onPaymentConfirmed,
  className,
}: PixPaymentProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = React.useState(false);

  const pixKey = "12345678901";

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Failed to copy PIX key - error handled silently
    }
  };

  const handleConfirmPayment = () => {
    setIsPaymentConfirmed(true);
    setTimeout(() => {
      onPaymentConfirmed();
    }, 1000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <QrCodeIcon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Pagamento via PIX</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR Code ou copie a chave PIX para pagar
        </p>
      </div>

      <div className="bg-card rounded-lg border-2 border-dashed p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <QrCodeIcon className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">QR Code PIX</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold">
              R$ {amount.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-muted-foreground">Valor do serviço</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Chave PIX</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
              {pixKey}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPixKey}
              className="shrink-0"
            >
              {isCopied ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <SmartphoneIcon className="w-5 h-5 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Como pagar com PIX</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Abra o app do seu banco</li>
                <li>• Escaneie o QR Code ou cole a chave PIX</li>
                <li>• Confirme o pagamento</li>
                <li>• Clique em &quot;Confirmar Pagamento&quot; abaixo</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirmPayment}
          disabled={isPaymentConfirmed}
          className="w-full"
          size="lg"
        >
          {isPaymentConfirmed ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Pagamento Confirmado!
            </>
          ) : (
            "Confirmar Pagamento"
          )}
        </Button>
      </div>
    </div>
  );
}
