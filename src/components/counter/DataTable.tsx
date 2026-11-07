import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { SquarePen, Trash, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import EditDialog from "@/components/counter/EditDialog";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import type { Counter } from "@/components/counter/types";
import { $uuid } from "@/stores/counter";

export default function DataTable({ username }: { username: string }) {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter>();
  const selectedUuid = useStore($uuid);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const countersData = document.getElementById("counters-data");

    if (countersData?.textContent) {
      const data: Counter[] = JSON.parse(countersData.textContent);

      setCounters(data);
      $uuid.set(data.at(0)?.uuid ?? ""); // Select first when load data
    }
  }, []);

  function formatDate(isoDateTime: string) {
    return new Date(isoDateTime).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleEdit(counter: Counter) {
    setSelectedCounter(counter);
    setOpenEdit(true);
  }

  function handleSave(updatedCounter: Counter) {
    setCounters((prev) => prev.map((u) => (u.uuid === updatedCounter.uuid ? updatedCounter : u)));
    setOpenEdit(false);
  }

  // The counter is created by the server: random UUID and value zero
  async function handleCreate() {
    setIsLoading(true);
    const toastId = toast.loading("Criando contador…");

    try {
      const response = await fetch("/counter", {
        method: "POST",
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      // Add the new counter to the list and select it
      const counter: Counter = await response.json();

      if (counter) {
        setCounters((prev) => [counter, ...prev]);
        $uuid.set(counter.uuid);
      }

      toast.success("Contador criado com sucesso.", { id: toastId });
      setOpenConfirm(false);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contadores</h1>
          <span className="text-muted-foreground text-sm">{counters && counters.length} contador(es)</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setOpenConfirm(true)}>
            <Plus />
            Novo Contador
          </Button>
        </div>
      </div>

      <RadioGroup value={selectedUuid} onValueChange={$uuid.set}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-muted-foreground">Selecione UUID</TableHead>
              <TableHead className="font-bold text-muted-foreground">Valor</TableHead>
              <TableHead className="font-bold text-muted-foreground">Data</TableHead>
              <TableHead className="font-bold text-muted-foreground">Origem</TableHead>
              <TableHead className="font-bold text-muted-foreground">Mensagem</TableHead>
              <TableHead className="font-bold text-muted-foreground text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {counters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum contador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              counters.map((counter) => (
                <TableRow key={counter.uuid}>
                  <TableCell className="font-medium">
                    <div className="flex gap-2">
                      <RadioGroupItem value={counter.uuid} id={counter.uuid} />
                      <Label htmlFor={counter.uuid}>{counter.uuid}</Label>
                    </div>
                  </TableCell>
                  <TableCell>{counter.value}</TableCell>
                  <TableCell>{counter.metadata && formatDate(counter.metadata.time)}</TableCell>
                  <TableCell>{counter.metadata?.sender}</TableCell>
                  <TableCell>{counter.metadata?.message}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => handleEdit(counter)}>
                      <SquarePen />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Submit">
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <EditDialog
          open={openEdit}
          setOpen={setOpenEdit}
          username={username}
          counter={selectedCounter}
          onSave={handleSave}
        />
      </RadioGroup>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Novo Contador</AlertDialogTitle>
            <AlertDialogDescription>Deseja criar um novo contador?</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={handleCreate}>
              {isLoading ? "Criando…" : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
