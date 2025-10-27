"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreditCardIcon, LockIcon, CheckIcon } from "lucide-react";

interface CardPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
  className?: string;
}

export function CardPayment({
  amount,
  onPaymentConfirmed,
  className,
}: CardPaymentProps) {
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = React.useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCardCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentConfirmed(true);
      setTimeout(() => {
        onPaymentConfirmed();
      }, 1000);
    }, 2000);
  };

  const isFormValid =
    cardNumber.length >= 19 &&
    cardName &&
    cardExpiry.length === 5 &&
    cardCvv.length >= 3;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CreditCardIcon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Pagamento com Cartão</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do seu cartão para finalizar o pagamento
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="JOÃO DA SILVA"
              className="uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/AA"
                maxLength={5}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV</Label>
              <Input
                id="cardCvv"
                value={cardCvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={4}
                className="font-mono"
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total a pagar:</span>
              <span className="text-lg font-bold">
                R$ {amount.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LockIcon className="w-5 h-5 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Pagamento Seguro</p>
                <p className="text-xs text-muted-foreground">
                  Seus dados são criptografados e protegidos. Não armazenamos
                  informações do cartão.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isProcessing || isPaymentConfirmed}
            className="w-full"
            size="lg"
          >
            {isPaymentConfirmed ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Pagamento Confirmado!
              </>
            ) : isProcessing ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processando...
              </>
            ) : (
              "Pagar com Cartão"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
