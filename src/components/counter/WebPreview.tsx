import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { Link, Check, Copy } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { $style, $uuid } from "@/stores/counter";

const URL_ORIGIN = window.location.origin;

interface Props {
  username: string;
  uuid?: string;
}

export default function WebPreview({ username, uuid }: Props) {
  const [copyToClipboard, isCopied] = useCopyToClipboard();
  const selectedUuid = uuid ?? useStore($uuid);
  const defaultStyle = useStore($style);

  function getUrl() {
    let settings_encoded = encodeURIComponent(JSON.stringify(defaultStyle));
    return `${URL_ORIGIN}/widgets/counter/?username=${username}&uuid=${selectedUuid}&settings=${settings_encoded}`;
  }

  let url: string = getUrl();

  useEffect(() => {
    url = getUrl();
  }, [username, $uuid]);

  return (
    <div className="flex flex-col h-full items-center text-center gap-4 p-6">
      <h1 className="text-lg font-extrabold">Prévia do Widget - Web (Obsoleto)</h1>

      <div className="flex-1 flex items-center justify-center gap-2">
        <span
          className="mr-[0.2em] transition-all duration-200"
          style={{
            fontFamily: defaultStyle.font_family,
            color: defaultStyle.font_color,
            fontSize: defaultStyle.font_size_prefix,
          }}
        >
          {defaultStyle.prefix}
        </span>
        <span
          className="font-bold transition-all duration-200"
          style={{
            fontFamily: defaultStyle.font_family,
            color: defaultStyle.font_color,
            fontSize: defaultStyle.font_size_counter,
          }}
        >
          150
        </span>
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
