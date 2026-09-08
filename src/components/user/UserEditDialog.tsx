import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { User } from "./types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: User;
  onSave: (user: User) => void;
}

const roles = [
  { label: "Selecione um cargo", value: null },
  { label: "Admin", value: 0 },
  { label: "Streamer", value: 10 },
  { label: "Member", value: 20 },
];

export default function EditUserDialog({ open, setOpen, user, onSave }: Props) {
  const [draft, setDraft] = useState<User | undefined>(undefined);

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

  function handleFieldChange(field: keyof User, value: string) {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  }

  function handleRoleChange(field: keyof User, value: number | null) {
    if (!draft || value === null) return;
    setDraft({ ...draft, [field]: value });
  }

  async function handleSave() {
    if (!draft) return;
    const csrfToken = getCsrfToken();

    try {
      const response = await fetch(`/admin/users/${draft.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      onSave(draft);
      // const result = await response.text();
      // console.log("Success:", result);
    } catch (err) {
      console.error("Fail:", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        {draft && (
          <FieldGroup className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Field data-disabled>
                <FieldLabel htmlFor="username">Nome de Usuário</FieldLabel>
                <Input id="username" value={draft.username} disabled />
              </Field>
            </div>
            <div className="grid gap-2">
              <Field>
                <FieldLabel htmlFor="realname">Nome Real</FieldLabel>
                <Input
                  id="realname"
                  placeholder="Nome"
                  value={draft.realname}
                  onChange={(e) =>
                    handleFieldChange("realname", e.target.value)
                  }
                  autoFocus
                />
              </Field>
            </div>
            <div className="grid col-span-2 gap-2">
              <Field>
                <FieldLabel htmlFor="role-trigger">Cargo</FieldLabel>
                <Select
                  items={roles}
                  value={draft.role}
                  onValueChange={(e) => handleRoleChange("role", e)}
                >
                  <SelectTrigger id="role-trigger" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid col-span-2 gap-2">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="streamiau@email.com"
                  value={draft.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-2">
              <Field>
                <FieldLabel htmlFor="steamid">Steam ID</FieldLabel>
                <Input
                  id="steamid"
                  placeholder="SteamID64"
                  value={draft.steamid ?? ""}
                  onChange={(e) => handleFieldChange("steamid", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-2">
              <Field>
                <FieldLabel htmlFor="youtubeid">YouTube ID</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="youtubeid"
                    placeholder="Identificador do canal"
                    value={draft.youtubeid ?? ""}
                    onChange={(e) =>
                      handleFieldChange("youtubeid", e.target.value)
                    }
                  />
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>@</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
            <input
              type="hidden"
              name="authenticity_token"
              value="ECR%= csrf_token %ECR"
            />
          </FieldGroup>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
