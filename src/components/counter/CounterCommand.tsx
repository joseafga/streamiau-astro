import { useState } from "react";
import { useStore } from "@nanostores/react";
import { Terminal, Check, Copy, KeyRound, AlertTriangleIcon } from "lucide-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { $uuid } from "@/stores/counter";
import { Level, levelLabels } from "@/lib/levels";

const SENDER_NAME = "$(sender.name)";
const SENDER_LEVEL = "$(sender.level)";
const COMMAND_NAME = "!contador";
const NO_COUNTER = "Selecione um contador na tabela…";

const permissionItems = Object.values(Level).map((level) => ({
  label: `${level} - ${levelLabels[level as Level]}`,
  value: String(level),
}));

interface Props {
  username: string;
  token?: string;
  uuid?: string;
}

export default function CounterCommand({ username, token, uuid }: Props) {
  const storeUuid = useStore($uuid);
  const selectedUuid = uuid ?? storeUuid;
  const [editable, setEditable] = useState(false);
  const [permission, setPermission] = useState(String(Level.Moderator));
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  function getApiUrl() {
    return `${window.location.protocol}//${window.location.host}/api/v1/counter/${username}/${selectedUuid}`;
  }

  function getCommand() {
    if (!selectedUuid) return "";

    const query = "args=$(queryescape ${1:|@})";

    // Read-only; no token
    if (!editable) {
      return `!command add ${COMMAND_NAME} $(customapi ${getApiUrl()})`;
    }

    // Editable; with token
    return `!command add ${COMMAND_NAME} $(customapi ${getApiUrl()}?${query}&token=${token}&sender=${SENDER_NAME}&level=${SENDER_LEVEL}&permission=${permission})`;
  }

  const command = getCommand();
  const hasToken = token && token.length > 0;

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6 p-6">
      <header className="grid justify-items-center gap-4 text-center">
        <h1 className="text-lg font-extrabold">Comando para Bot</h1>

        <p className="text-center">
          {selectedUuid ? (
            <p>
              Contador selecionado: <strong>{selectedUuid}</strong>.
            </p>
          ) : (
            <p>Selecione um contador na tabela para gerar o comando.</p>
          )}
        </p>
      </header>

      <div className="grid content-start gap-4">
        <Field orientation="horizontal">
          <Checkbox
            id="editable"
            name="editable"
            checked={editable}
            onCheckedChange={(value) => setEditable(value as boolean)}
          />
          <div className="grid gap-1">
            <Label htmlFor="editable">Permitir alterar o valor do contador pelo chat</Label>
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
            <FieldDescription>Nível de acesso necessário para alterar o valor do contador pelo chat.</FieldDescription>
          </Field>
        )}

        {editable &&
          (hasToken ? (
            <Alert className="border-yellow-150 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-50">
              <AlertTriangleIcon />
              <AlertTitle>Não crie este comando pelo chat.</AlertTitle>
              <AlertDescription>
                O token de acesso ficaria visível na mensagem do chat. Cadastre o comando no painel do StreamElements.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-150 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
              <KeyRound />
              <AlertTitle>Token de acesso não encontrado. Verifique em seu Perfil.</AlertTitle>
            </Alert>
          ))}
      </div>

      <div className="grid">
        <InputGroup>
          <InputGroupInput value={command} readOnly placeholder={NO_COUNTER} />
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
