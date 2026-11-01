import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import type { User } from "@/components/user/types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (user: User) => void;
}

const EMPTY_USER: User = {
  username: "",
  realname: "",
  email: "",
  role: 20,
  tokens: [],
};

const roles = [
  { label: "Selecione um cargo", value: null },
  { label: "Admin", value: 0 },
  { label: "Streamer", value: 10 },
  { label: "Member", value: 20 },
];

export default function NewDialog({ open, setOpen, onCreate }: Props) {
  const [draft, setDraft] = useState<User>(EMPTY_USER);
  const [isLoading, setIsLoading] = useState(false);

  function handleFieldChange(field: keyof User, value: string) {
    setDraft((prev) => {
      return { ...prev, [field]: value };
    });
  }

  function handleRoleChange(value: number | null) {
    setDraft((prev) => {
      if (value === null) return prev;
      return { ...prev, role: value };
    });
  }

  async function handleCreate() {
    setIsLoading(true);
    const toastId = toast.loading("Criando usuário…");

    try {
      const response = await fetch(`/admin/users/${draft.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      onCreate(draft);
      setDraft(EMPTY_USER);
      toast.success("Criado com sucesso.", { id: toastId });
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
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>

        <FieldGroup className="grid grid-cols-2 gap-4 py-4">
          <div className="grid gap-2">
            <Field>
              <FieldLabel htmlFor="username">Nome de Usuário</FieldLabel>
              <Input
                id="username"
                placeholder="Nome de Usuário"
                value={draft.username}
                onChange={(e) => handleFieldChange("username", e.target.value)}
                autoFocus
              />
            </Field>
          </div>
          <div className="grid gap-2">
            <Field>
              <FieldLabel htmlFor="realname">Nome Real</FieldLabel>
              <Input
                id="realname"
                placeholder="Nome"
                value={draft.realname}
                onChange={(e) => handleFieldChange("realname", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid col-span-2 gap-2">
            <Field>
              <FieldLabel htmlFor="role-trigger">Cargo</FieldLabel>
              <Select items={roles} value={draft.role} onValueChange={(e) => handleRoleChange(e)}>
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
                  onChange={(e) => handleFieldChange("youtubeid", e.target.value)}
                />
                <InputGroupAddon align="inline-start">
                  <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
