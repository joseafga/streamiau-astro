import { useState } from "react";
import { Terminal, Check, Copy } from "lucide-react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface Props {
  username: string;
  youtubeid?: string;
}

export default function LastShort({ username, youtubeid }: Props) {
  const [commandText, setCommandText] = useState(`Confira o último shorts do canal: {short}`);
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  function getUrl() {
    return `${window.location.protocol}//${window.location.host}/api/v1/youtube/${youtubeid}/shorts/last`;
  }

  const command = "!command add !short " + commandText.replace("{short}", `$(customapi ${getUrl()})`);
  const hasCommandWord = commandText.includes("{short}");

  return youtubeid ? (
    <div className="flex flex-col h-full gap-4 p-6 mx-auto">
      <h1 className="text-lg font-extrabold text-center">Último Short - Comando para Bot</h1>

      <p className="text-center">
        Exiba o último short de seu canal do youtube através de um comando de Bot (StreamElements).
      </p>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <Field>
          <FieldLabel htmlFor="command-text">Texto</FieldLabel>
          <Input
            id="command-text"
            name="command-text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
          />
          {hasCommandWord ? (
            <FieldDescription>
              O termo <em>{"{short}"}</em> será substituído pelo título e URL do short.
            </FieldDescription>
          ) : (
            <FieldError>
              Inclua o termo <em>{"{short}"}</em> para o valor ser substituído.
            </FieldError>
          )}
        </Field>
      </div>

      <InputGroup>
        <InputGroupInput value={command} readOnly />
        <InputGroupAddon>
          <Terminal />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copiar"
            title="Copiar"
            size="icon-xs"
            onClick={() => {
              copyToClipboard(command);
            }}
          >
            {isCopied ? <Check /> : <Copy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ) : (
    <p className="p-6 text-center">Nenhuma conta Youtube vinculada ao usuário.</p>
  );
}
