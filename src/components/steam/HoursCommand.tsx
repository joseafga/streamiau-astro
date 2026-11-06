import { useState } from "react";
import { Terminal, Check, Copy } from "lucide-react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface Props {
  username: string;
  steamid?: string;
}

export default function HoursCommand({ username, steamid }: Props) {
  const [appid, setAppid] = useState("0");
  const [commandText, setCommandText] = useState(`${username} possui {horas} horas de jogo.`);
  const [copyToClipboard, isCopied] = useCopyToClipboard();

  function getUrl() {
    return `${window.location.protocol}//${window.location.host}/api/v1/steam/${username}/${appid}/hours`;
  }

  const command = "!command add !horas " + commandText.replace("{horas}", `$(customapi ${getUrl()})`);
  const hasCommandWord = commandText.includes("{horas}");

  return steamid ? (
    <div className="flex flex-col h-full gap-4 p-6 mx-auto">
      <h1 className="text-lg font-extrabold text-center">Horas jogadas - Comando para Bot</h1>

      <p className="text-center">Exiba o número de horas jogadas através de um comando de Bot (StreamElements).</p>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-4">
        <Field>
          <FieldLabel htmlFor="appid">AppID</FieldLabel>
          <Input
            id="appid"
            name="appid"
            value={appid}
            inputMode="numeric"
            onChange={(e) => setAppid(e.target.value.replace(/\D/g, ""))}
            placeholder="AppID"
          />
          <FieldDescription>
            Não sabe qual é o AppID? Pesquise em{" "}
            <a href="https://steamdb.info/apps/" target="_blank" rel="noopener noreferrer">
              steamdb.info
            </a>
            .
          </FieldDescription>
        </Field>
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
              O termo <em>{"{horas}"}</em> será substituído pelas suas horas jogadas na Steam.
            </FieldDescription>
          ) : (
            <FieldError>
              Inclua o termo <em>{"{horas}"}</em> para o valor ser substituído.
            </FieldError>
          )}
        </Field>
      </div>

      <InputGroup className="mt-4">
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
    <p className="p-6 text-center">Nenhuma conta Steam vinculada ao usuário.</p>
  );
}
