import { useState } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import { $categories, loadPhrases } from "@/stores/phrases";

const EMPTY_PHRASE = { category: "", phrase: "" };

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function NewDialog({ open, setOpen }: Props) {
  const categories = useStore($categories);
  const [draft, setDraft] = useState(EMPTY_PHRASE);
  const [isLoading, setIsLoading] = useState(false);

  const hasCategory = draft.category.trim().length > 0;
  const hasPhrase = draft.phrase.trim().length > 0;
  const categoryExists = categories.includes(draft.category);

  async function handleCreate() {
    if (!hasCategory || !hasPhrase) return;

    setIsLoading(true);
    const toastId = toast.loading("Adicionando frase…");

    try {
      const response = await fetch(`/phrases/${draft.category}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: draft.phrase.trim(),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      loadPhrases(await response.json());
      setOpen(false);
      setDraft(EMPTY_PHRASE);
      toast.success("Frase adicionada com sucesso.", { id: toastId });
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Nova Frase</DialogTitle>
        </DialogHeader>

        <FieldGroup className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="new-category">Categoria</FieldLabel>
            <Input
              id="new-category"
              placeholder="categoria"
              value={draft.category}
              onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
              autoComplete="off"
              autoFocus
            />
            {hasCategory && !categoryExists && (
              <FieldDescription>
                A categoria <span className="font-medium text-foreground">{draft.category}</span> não existe e será
                criada.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="new-phrase">Frase</FieldLabel>
            <Input
              id="new-phrase"
              placeholder="Digite a frase"
              value={draft.phrase}
              onChange={(e) => setDraft((prev) => ({ ...prev, phrase: e.target.value }))}
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isLoading || !hasCategory || !hasPhrase}>
            <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
