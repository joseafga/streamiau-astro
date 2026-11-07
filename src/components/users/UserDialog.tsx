import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import type { User } from "@/components/users/types";

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

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (user: User) => void;
  user?: User;
}

export default function UserDialog({ open, setOpen, onSave, user }: Props) {
  const isEdit = !!user;
  const [draft, setDraft] = useState<User>(EMPTY_USER);
  const [isLoading, setIsLoading] = useState(false);

  // Re-seed the draft whenever the dialog opens so unsaved edits from a
  // previous session are discarded and the same user can be reopened.
  useEffect(() => {
    setDraft(user || EMPTY_USER);
  }, [user, open]);

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

  async function handleSubmit() {
    setIsLoading(true);
    const toastId = toast.loading(isEdit ? "Salvando mudanças…" : "Criando usuário…");

    try {
      const response = await fetch(`/admin/users/${draft.username}`, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      onSave(await response.json());
      if (!isEdit) setDraft(EMPTY_USER);
      toast.success(isEdit ? "Editado com sucesso." : "Criado com sucesso.", { id: toastId });
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
          <DialogTitle>{isEdit ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        </DialogHeader>

        <FieldGroup className="grid grid-cols-2 gap-4 py-4">
          <Field data-disabled={isEdit || undefined}>
            <FieldLabel htmlFor="username">Nome de Usuário</FieldLabel>
            <Input
              id="username"
              placeholder="Nome de Usuário"
              value={draft.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              disabled={isEdit}
              autoFocus={!isEdit}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="realname">Nome Real</FieldLabel>
            <Input
              id="realname"
              placeholder="Nome"
              value={draft.realname}
              onChange={(e) => handleFieldChange("realname", e.target.value)}
              autoFocus={isEdit}
            />
          </Field>
          <Field className="col-span-2">
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
          <Field className="col-span-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="streamiau@email.com"
              value={draft.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="steamid">Steam ID</FieldLabel>
            <Input
              id="steamid"
              placeholder="SteamID64"
              value={draft.steamid ?? ""}
              onChange={(e) => handleFieldChange("steamid", e.target.value)}
            />
          </Field>
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
        </FieldGroup>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !draft.username || !draft.realname || !draft.email}>
            <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
            {isEdit ? "Salvar" : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
