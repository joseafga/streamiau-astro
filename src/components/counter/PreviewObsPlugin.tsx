import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { Link, Check, Copy } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { uuid } from "@/stores/counter";

const WS_URL_PROTOCOL = window.location.protocol == "http:" ? "ws:" : "wss:";
const WS_URL_HOST = window.location.host;

interface Props {
  username: string;
}

export default function PreviewObsPlugin({ username }: Props) {
  const [copyToClipboard, isCopied] = useCopyToClipboard();
  const selectedUuid = useStore(uuid);

  function getUrl() {
    return `${WS_URL_PROTOCOL}//${WS_URL_HOST}/api/v1/counter/${username}/${selectedUuid}/ws`;
  }

  let url: string = getUrl();

  useEffect(() => {
    url = getUrl();
  }, [username, uuid]);

  return (
    <div className="flex flex-col h-full items-center text-center gap-4 p-6">
      <h1 className="text-lg font-extrabold">WebSocket - OBS Plugin</h1>
      <div className="flex-1 flex items-center justify-center gap-2">
        <p>
          Para utilização com o{" "}
          <a
            href="https://github.com/joseafga/streamiau-obs-counter"
            target="_blank"
            className="text-primary hover:underline"
          >
            Plugin do OBS
          </a>
          . Insira o valor abaixo no campo de <strong>`WebSocket`</strong> das configurações do plugin.
        </p>
      </div>
      <div className="flex flex-row items-center w-full">
        <InputGroup>
          <InputGroupInput value={url} readOnly />
          <InputGroupAddon>
            <Link />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copiar"
              title="Copiar"
              size="icon-xs"
              onClick={() => {
                copyToClipboard(url);
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
