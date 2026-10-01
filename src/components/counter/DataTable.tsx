import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { SquarePen, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/counter/EditDialog";
import type { Counter } from "@/components/counter/types";
import { $uuid } from "@/stores/counter";

export default function DataTable({ username }: { username: string }) {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter>();
  const selectedUuid = useStore($uuid);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const countersData = document.getElementById("counters-data");

    if (countersData?.textContent) {
      setCounters(JSON.parse(countersData.textContent));
    }
  }, []);

  // Select first when load data
  useEffect(() => {
    $uuid.set(counters.at(0)?.uuid ?? "");
  }, [counters]);

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

  return (
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
          {counters.map((counter) => (
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
          ))}
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
  );
}
