import { useState } from "react";
import { toast } from "sonner";
import { BrushCleaning } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getCsrfToken } from "@/helpers/use-csrf-token";

export default function ClearCacheButton() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClearCache() {
    setIsLoading(true);
    const toastId = toast.loading("Limpando o cache…");

    try {
      const response = await fetch(`/admin/users`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      toast.success("Limpo com sucesso.", { id: toastId });
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" disabled={isLoading}>
            <BrushCleaning />
            Limpar Cache
          </Button>
        }
      />

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar o cache?</AlertDialogTitle>
          <AlertDialogDescription>
            O cache de usuários e tokens será invalidado e a próxima listagem fará uma nova consulta ao banco de dados.
            Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleClearCache}>
            {isLoading ? "Limpando…" : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
