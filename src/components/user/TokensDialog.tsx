import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldContent,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { TokenItem } from "./TokenItem";
import type { User, Token } from "./types";
import { allowLabels, allowDescriptions, Allow } from "./types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: User;
  onSave: (user: User) => void;
}

export default function TokensDialog({ open, setOpen, user, onSave }: Props) {
  const [draft, setDraft] = useState<User | undefined>(undefined);
  const [permissions, setPermissions] = useState<Allow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDraft(user);
  }, [user]);

  function getCsrfToken(): string {
    const csrfToken = document
      .querySelector('meta[name="authenticity-token"]')
      ?.getAttribute("content");

    if (csrfToken) return csrfToken;

    throw new Error("CSRF Token não foi encontrado.");
  }

  function handleToggle(value: Allow, checked: boolean) {
    if (checked) {
      setPermissions((prev) => [...prev, value]);
    } else {
      setPermissions((prev) => prev.filter((n) => n !== value));
    }
  }

  async function handleGenerate() {
    if (!draft) return;
    if (permissions.length == 0) return;

    setIsLoading(true);
    const toastId = toast.loading("Gerando token…");

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/admin/users/${draft.username}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(permissions),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      const resultToken = (await response.json()) as Token;
      draft.tokens.push(resultToken);
      onSave(draft);
      toast.success("Token gerado com sucesso.", { id: toastId });
      setIsLoading(false);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
      setIsLoading(false);
    }
  }

  async function handleDelete(token: Token) {
    if (!draft) return;

    setIsLoading(true);
    const toastId = toast.loading("Deletando token…");

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/admin/users/${draft.username}/token`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: token.value,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      // const result = await response.text(); // response will be null
      draft.tokens = draft.tokens.filter((t) => t.value !== token.value);
      onSave(draft);
      toast.success("Token deletado com sucesso.", { id: toastId });
      setIsLoading(false);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
      setIsLoading(false);
    }

    console.log(token);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Tokens do Usuário</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="show">
          <TabsList className="mx-auto">
            <TabsTrigger value="show">Tokens ativos</TabsTrigger>
            <TabsTrigger value="new">Gerar novo</TabsTrigger>
          </TabsList>
          <TabsContent value="show">
            <div className="grid gap-2">
              {draft &&
                draft.tokens.map((token) => (
                  <TokenItem
                    key={token.value}
                    token={token}
                    onDelete={handleDelete}
                    variant="muted"
                    className={
                      isLoading
                        ? "transition-opacity opacity-70 pointer-events-none"
                        : "transition-opacity"
                    }
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <FieldSet>
              <FieldGroup className="gap-3 my-2">
                {Object.entries(Allow).map(([key, value]) => (
                  <Field key={key} orientation="horizontal" className="w-full">
                    <FieldContent>
                      <FieldLabel htmlFor={key}>
                        {allowLabels[value]}
                      </FieldLabel>
                      <FieldDescription>
                        {allowDescriptions[value]}
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id={key}
                      onCheckedChange={(checked) =>
                        handleToggle(value, checked)
                      }
                    />
                  </Field>
                ))}
              </FieldGroup>
              <Button onClick={handleGenerate} disabled={isLoading}>
                <Spinner
                  data-icon="inline-start"
                  className={isLoading ? "" : "hidden"}
                />
                Gerar novo Token
              </Button>
            </FieldSet>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
