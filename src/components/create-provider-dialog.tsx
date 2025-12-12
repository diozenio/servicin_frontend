"use client";

import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateServiceProvider } from "@/hooks/use-provider";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Hammer } from "lucide-react";

interface CreateProviderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProviderDialog({
    open,
    onOpenChange,
}: CreateProviderDialogProps) {
    const { user } = useAuth();
    const { mutate: createProvider, isPending } = useCreateServiceProvider();

    const handleConfirm = () => {
        if (!user?.id) {
            toast.error("Usuário não autenticado");
            return;
        }

        createProvider({ userId: user.id }, {
            onSuccess: async () => {
                toast.success("Parabéns! Você agora é um provedor de serviços!");
                setTimeout(() => {
                    onOpenChange(false);
                }, 100);
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erro ao tornar-se provedor. Tente novamente."
                );
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Hammer className="h-5 w-5" />
                        Tornar-se Provedor de Serviços
                    </DialogTitle>
                </DialogHeader>
                <div className="pt-2 text-sm text-muted-foreground space-y-3">
                    <p>Você está prestes a se tornar um provedor de serviços. Isso permitirá que você:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Ofereça seus serviços para clientes</li>
                        <li>Gerencie seus próprios agendamentos</li>
                        <li>Crie e edite categorias de serviços</li>
                        <li>Receba avaliações dos clientes</li>
                    </ul>
                    <p className="font-medium">Deseja continuar?</p>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isPending}>
                        {isPending ? "Processando..." : "Sim, quero ser provedor"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
