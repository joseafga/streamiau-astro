import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import NewDialog from "@/components/phrases/NewDialog";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import { $categories, $phrases, loadPhrases, removePhrase } from "@/stores/phrases";

type Row = {
  key: string;
  index: number;
  category: string;
  phrase: string;
};

export default function DataTable() {
  const phrases = useStore($phrases);
  const categories = useStore($categories);
  const [deleting, setDeleting] = useState<Row>();
  const [openNew, setOpenNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPhrases();
  }, []);

  const rows: Row[] = categories.flatMap((name) =>
    (phrases?.categories[name]?.phrases ?? []).map((phrase, index) => ({
      key: `${name}-${index}`,
      index,
      category: name,
      phrase,
    })),
  );

  async function handleDelete() {
    if (!deleting) return;
    const { index, category, phrase } = deleting;

    setIsLoading(true);
    const toastId = toast.loading("Removendo frase…");

    try {
      const response = await fetch(`/phrases/${category}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: phrase,
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      removePhrase(category, index);
      toast.success("Frase removida com sucesso.", { id: toastId });
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
    } finally {
      setIsLoading(false);
      setDeleting(undefined);
    }
  }

  return (
    <div className="mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Frases</h1>
          <span className="text-muted-foreground text-sm">
            {categories.length} categoria(s) -{" "}
            {phrases && Object.values(phrases.categories).reduce((acc, arr) => acc + arr.phrases.length, 0)} frase(s)
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setOpenNew(true)}>
            <Plus />
            Nova Frase
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48 font-bold text-muted-foreground">Categoria</TableHead>
            <TableHead className="font-bold text-muted-foreground">Frase</TableHead>
            <TableHead className="font-bold text-muted-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                Nenhuma frase encontrada.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="font-medium whitespace-normal">{row.category}</TableCell>
                <TableCell className="whitespace-normal">{row.phrase}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="icon" aria-label="Remover" onClick={() => setDeleting(row)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(undefined)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover frase?</AlertDialogTitle>
            <AlertDialogDescription>
              A frase "<span className="font-medium text-foreground">{deleting?.phrase}</span>" será removida. Deseja
              continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={isLoading} onClick={handleDelete}>
              {isLoading ? "Removendo…" : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NewDialog open={openNew} setOpen={setOpenNew} />
    </div>
  );
}
