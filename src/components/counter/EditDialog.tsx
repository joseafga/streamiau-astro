import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import type { Counter } from "@/components/counter/types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  username: string;
  counter?: Counter;
  onSave: (counter: Counter) => void;
}

export default function EditDialog({ open, setOpen, counter, username, onSave }: Props) {
  const [draft, setDraft] = useState<Counter>();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDraft(counter);
  }, [counter]);

  function handleValueChange(value: number) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, value: value };
    });
  }

  async function handleSave() {
    if (!draft) return;

    setIsLoading(true);
    const toastId = toast.loading("Salvando mudanças…");
    const counter = {
      ...draft,
      metadata: {
        time: new Date().toISOString(),
        sender: username,
        message: message,
      },
    };

    try {
      const response = await fetch(`/counter/${counter.uuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: JSON.stringify(counter),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      onSave(counter);
      toast.success("Editado com sucesso.", { id: toastId });
      setIsLoading(false);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-80">
        <DialogHeader>
          <DialogTitle>Editar Contador</DialogTitle>
        </DialogHeader>

        {draft && (
          <FieldGroup className="gap-4 py-4">
            <Field>
              <div className="flex place-content-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-full"
                  onClick={() => handleValueChange(draft.value - 1)}
                >
                  <Minus />
                </Button>

                <Input
                  value={draft.value}
                  onChange={(e) => handleValueChange(Number(e.target.value))}
                  className="w-24 h-12 text-center text-lg!"
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-full"
                  onClick={() => handleValueChange(draft.value + 1)}
                >
                  <Plus />
                </Button>
              </div>
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor="sender">Origem</FieldLabel>
              <Input id="sender" value={username} disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Mensagem</FieldLabel>
              <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
          </FieldGroup>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
