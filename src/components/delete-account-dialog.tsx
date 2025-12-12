import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useDeleteAccount } from "@/hooks/use-delete-account";

export default function DeleteAccountDialog() {
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir conta</DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja excluir sua conta? Esta ação não pode ser
          desfeita.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex justify-end gap-2">
        <DialogTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogTrigger>

        <Button
          variant="destructive"
          className="hover:bg-destructive/40!"
          disabled={isPending}
          onClick={() => deleteAccount()}
        >
          {isPending ? "Excluindo..." : "Excluir definitivamente"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
