import { useState } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorPicker, parseColor } from "@/components/ui/fill-picker-base/color-picker";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import { $style, $uuid } from "@/stores/counter";

const fonts = [
  { label: "Selecione uma fonte...", value: null },
  { label: "Inter", value: "Inter" },
  { label: "Roboto", value: "Roboto" },
  { label: "Sniglet", value: "Sniglet" },
  { label: "sans-serif", value: "sans-serif" },
  { label: "serif", value: "serif" },
  { label: "monospace", value: "monospace" },
];
const fontSizePrefixMarks = [0, 61, 122, 183, 244];
const fontSizeCounterMarks = [0, 61, 122, 183, 244];

interface Props {
  uuid?: string;
}

export default function WebPreviewSettings({ uuid }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const selectedUuid = uuid ?? useStore($uuid);
  const defaultStyle = useStore($style);
  const [color, setColor] = useState(() => parseColor(defaultStyle.font_color)!);
  const [hex, setHex] = useState(defaultStyle.font_color);

  async function handleApply() {
    setIsLoading(true);
    const toastId = toast.loading("Aplicando…");

    try {
      const response = await fetch(`/counter/${selectedUuid}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: JSON.stringify(defaultStyle),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      toast.success("Aplicado com sucesso.", { id: toastId });
      setIsLoading(false);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex flex-col gap-5 p-6">
      <h1 className="text-lg font-extrabold w-full text-center">Aparência do Widget - Web (Obsoleto)</h1>

      <Field>
        <Select
          items={fonts}
          defaultValue="Inter"
          onValueChange={(value) => $style.setKey("font_family", value as string)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {fonts.map((font) => (
                <SelectItem key={font.label} value={font.value} style={font.value ? { fontFamily: font.value } : {}}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <Input
          name="prefix"
          value={defaultStyle.prefix}
          onChange={(e) => $style.setKey("prefix", e.target.value as string)}
          placeholder="Prefixo"
          autoComplete="off"
        />
      </Field>

      <Field orientation="horizontal" className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                className="border-input relative overflow-hidden"
                size={"icon"}
                style={{ backgroundColor: hex }}
              />
            }
          />
          <PopoverContent align="start" sideOffset={8} className="w-auto p-0 border-0 bg-transparent shadow-none">
            <ColorPicker.Root
              value={color}
              onValueChange={(next, _formatted, formats) => {
                setColor(next);
                setHex(formats.hex);
                $style.setKey("font_color", formats.hex);
              }}
              backgroundColor="rgba(174, 46, 32, 0.32)"
              formats={["hex", "rgb", "hsl", "oklch"]}
            >
              <ColorPicker.Area mode="hsv-sv" showWarningLines={false} />
              <div className="flex flex-col gap-1.5">
                <ColorPicker.Hue />
                <ColorPicker.Alpha />
              </div>
              <ColorPicker.ChannelInput />
            </ColorPicker.Root>
          </PopoverContent>
        </Popover>
        <span>{hex}</span>
      </Field>

      <Field>
        <Label htmlFor="font-size-prefix">Tamanho do prefixo</Label>
        <Slider
          id="font-size-prefix"
          name="font-size-prefix"
          defaultValue={defaultStyle.font_size_prefix}
          onValueChange={(value) => $style.setKey("font_size_prefix", value as number)}
          max={244}
        />
        <div className="flex items-center justify-between text-muted-foreground text-xs tabular-nums">
          <span className="w-6 text-left">{fontSizePrefixMarks[0]}</span>
          <span className="w-6 text-center">{fontSizePrefixMarks[1]}</span>
          <span className="w-6 text-center">{fontSizePrefixMarks[2]}</span>
          <span className="w-6 text-center">{fontSizePrefixMarks[3]}</span>
          <span className="w-6 text-right">{fontSizePrefixMarks[4]}</span>
        </div>
      </Field>

      <Field>
        <Label htmlFor="font-size-counter">Tamanho do contador</Label>
        <Slider
          id="font-size-counter"
          name="font-size-counter"
          defaultValue={defaultStyle.font_size_counter}
          onValueChange={(value) => $style.setKey("font_size_counter", value as number)}
          max={244}
        />
        <div className="flex items-center justify-between text-muted-foreground text-xs tabular-nums">
          <span className="w-6 text-left">{fontSizeCounterMarks[0]}</span>
          <span className="w-6 text-center">{fontSizeCounterMarks[1]}</span>
          <span className="w-6 text-center">{fontSizeCounterMarks[2]}</span>
          <span className="w-6 text-center">{fontSizeCounterMarks[3]}</span>
          <span className="w-6 text-right">{fontSizeCounterMarks[4]}</span>
        </div>
      </Field>

      <FieldGroup className="mt-5">
        <Field orientation="horizontal">
          <Checkbox
            id="fixed-style"
            name="fixed-style"
            onCheckedChange={(value) => $style.setKey("fixed_style", value as boolean)}
          />
          <Label htmlFor="fixed-style">Não alterar a aparência posteriormente</Label>
        </Field>
        <Button type="submit" onClick={handleApply} disabled={isLoading}>
          <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
          Aplicar
        </Button>
      </FieldGroup>
    </div>
  );
}
