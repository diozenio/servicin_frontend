"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancelServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  contractId: string;
  serviceName?: string;
  className?: string;
}

export function CancelServiceDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  contractId,
  serviceName,
  className,
}: CancelServiceDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Por favor, informe o motivo do cancelamento.");
      return;
    }

    if (reason.trim().length < 10) {
      setError("O motivo deve ter pelo menos 10 caracteres.");
      return;
    }

    setError("");
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-left">Cancelar Serviço</DialogTitle>
              <DialogDescription className="text-left">
                {serviceName ? `Cancelar "${serviceName}"` : "Cancelar serviço"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Motivo do cancelamento *
            </label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo do cancelamento (mínimo 10 caracteres)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              className={cn(
                "min-h-[100px] resize-none",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• O cancelamento é irreversível</li>
                  <li>• O horário será liberado para outros clientes</li>
                  <li>
                    • Se o pagamento foi realizado, será processado o reembolso
                  </li>
                  <li>• O prestador será notificado sobre o cancelamento</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Manter Serviço
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !reason.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                  Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
