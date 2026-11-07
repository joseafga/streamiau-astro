import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { Terminal, Check, Copy, KeyRound, AlertTriangleIcon } from "lucide-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { $categories, loadPhrases } from "@/stores/phrases";
import { Level, levelLabels } from "@/components/phrases/types";

interface Props {
  username: string;
  token?: string;
}

const SENDER_NAME = "$(sender.name)";
const SENDER_LEVEL = "$(sender.level)";
const NO_CATEGORY = "Selecione uma categoria…";

const permissionItems = Object.values(Level).map((level) => ({
  label: `${level} - ${levelLabels[level as Level]}`,
  value: String(level),
}));

export default function PhrasesCommand({ username, token }: Props) {
  const categories = useStore($categories);
  const [category, setCategory] = useState("");
  const [editable, setEditable] = useState(false);
  const [permission, setPermission] = useState(String(Level.Moderator));
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  useEffect(() => {
    loadPhrases();
  }, []);

  function getApiUrl() {
    return `${window.location.protocol}//${window.location.host}/api/v1/phrases/${username}/${category}`;
  }

  function getCommand() {
    if (!category) return "";

    const query = "args=$(queryescape ${1:|random})";

    // Read-only; no token
    if (!editable) {
      return `!command add !${category} $(customapi ${getApiUrl()}?${query})`;
    }

    // Editable; with token
    return `$(customapi ${getApiUrl()}?${query}&token=${token}&sender=${SENDER_NAME}&level=${SENDER_LEVEL}&permission=${permission})`;
  }

  const command = getCommand();
  const hasToken = token && token.length > 0;

  const categoryItems: { label: string; value: string | null }[] = [
    { label: NO_CATEGORY, value: null },
    ...categories.map((name) => ({ label: name, value: name })),
  ];

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6 p-6">
      <header className="grid justify-items-center gap-4 text-center">
        <h1 className="text-lg font-extrabold">Comando para Bot</h1>

        <p className="text-center">Exiba frases de uma categoria através de um comando de Bot (StreamElements).</p>
      </header>

      <div className="grid content-start gap-4">
        <Field>
          <FieldLabel htmlFor="category">Categoria</FieldLabel>
          <Select value={category || null} onValueChange={(value) => setCategory(value ?? "")} items={categoryItems}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder={NO_CATEGORY} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {categories.length > 0 || <FieldDescription>Nenhuma categoria encontrada.</FieldDescription>}
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="editable"
            name="editable"
            checked={editable}
            onCheckedChange={(value) => setEditable(value as boolean)}
          />
          <div className="grid gap-1">
            <Label htmlFor="editable">Permitir adicionar e remover frases pelo chat</Label>
            <FieldDescription>Usa seu token de acesso para autorizar alterações.</FieldDescription>
          </div>
        </Field>

        {editable && (
          <Field>
            <FieldLabel htmlFor="permission">Permissão</FieldLabel>
            <Select
              value={permission}
              onValueChange={(value) => setPermission(value as string)}
              items={permissionItems}
            >
              <SelectTrigger id="permission" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {permissionItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Nível de acesso necessário para adicionar e remover as frases pelo chat.
            </FieldDescription>
          </Field>
        )}

        {editable &&
          (hasToken ? (
            <Alert className=" border-yellow-150 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-50">
              <AlertTriangleIcon />
              <AlertTitle>Não crie este comando pelo chat.</AlertTitle>
              <AlertDescription>
                O token de acesso ficaria visível na mensagem do chat. Cadastre o comando no painel do StreamElements.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className=" border-red-150 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
              <KeyRound />
              <AlertTitle>Token de acesso não encontrado. Verifique em seu Perfil.</AlertTitle>
            </Alert>
          ))}
      </div>

      <div className="grid">
        <InputGroup>
          <InputGroupInput value={command} readOnly placeholder="Selecione uma categoria…" />
          <InputGroupAddon>
            <Terminal />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copiar"
              title="Copiar"
              size="icon-xs"
              disabled={!command}
              onClick={() => {
                copyToClipboard(command);
              }}
            >
              {isCopied ? <Check /> : <Copy />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
