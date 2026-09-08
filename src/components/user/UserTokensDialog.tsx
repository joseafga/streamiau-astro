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
import TokenItem from "./TokenItem";
import type { User, Token } from "./types";
import { allowLabels, allowDescriptions, Allow } from "./types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: User;
}

export default function UserTokensDialog({ open, setOpen, user }: Props) {
  const [draft, setDraft] = useState<User | undefined>(undefined);
  const [permissions, setPermissions] = useState<Allow[]>([]);

  useEffect(() => {
    setDraft(user);
  }, [user]);

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

    const csrfToken = document
      .querySelector('meta[name="authenticity-token"]')
      ?.getAttribute("content");
    if (!csrfToken) return;

    try {
      const response = await fetch(`/admin/users/${draft.username}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(permissions),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      // onSave(draft);
      const result = await response.text();
      console.log("Success:", result);
    } catch (err) {
      console.error("Fail:", err);
    }
  }

  async function handleDelete(token: Token) {
    if (!draft) return;

    const csrfToken = document
      .querySelector('meta[name="authenticity-token"]')
      ?.getAttribute("content");
    if (!csrfToken) return;

    try {
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

      // onSave(draft);
      const result = await response.text();
      console.log("Success:", result);
    } catch (err) {
      console.error("Fail:", err);
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
                  <TokenItem token={token} onDelete={handleDelete} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <FieldSet>
              <FieldGroup className="gap-3 my-2">
                {Object.entries(Allow).map(([key, value]) => (
                  <Field orientation="horizontal" className="w-full">
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
              <Button onClick={handleGenerate}>Gerar novo Token</Button>
            </FieldSet>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
