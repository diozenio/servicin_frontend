"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  LoaderIcon,
  AlertCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApproveAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ApproveAppointmentDialog({
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
  className,
}: ApproveAppointmentDialogProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = () => {
    setAction("approve");
    onApprove();
  };

  const handleReject = () => {
    setAction("reject");
    onReject();
  };

  const handleClose = () => {
    if (!isLoading) {
      setAction(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircleIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-left">
                Aprovar ou Recusar Agendamento
              </DialogTitle>
              <DialogDescription className="text-left">
                Escolha uma ação para este agendamento
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              O cliente já realizou o pagamento. Você pode aprovar o agendamento
              para que o serviço possa ser executado, ou recusá-lo (o pagamento
              será reembolsado automaticamente).
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Ao aprovar, o agendamento estará confirmado e o serviço
                    poderá ser executado
                  </li>
                  <li>
                    • Ao recusar, o pagamento será reembolsado automaticamente
                  </li>
                  <li>• Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 !justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading && action === "reject" ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                    Recusando...
                  </>
                ) : (
                  <>
                    <ThumbsDownIcon className="w-4 h-4 mr-2" />
                    Recusar
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading && action === "approve" ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                    Aprovando...
                  </>
                ) : (
                  <>
                    <ThumbsUpIcon className="w-4 h-4 mr-2" />
                    Aprovar
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

