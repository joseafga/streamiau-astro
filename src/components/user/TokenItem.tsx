import { useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, EyeOffIcon, Trash } from "lucide-react";
import type { Token, Allow } from "./types";
import { allowLabels } from "./types";

interface Props {
  token: Token;
  onDelete?: (token: Token) => void;
}

export default function TokenItem(props: Props) {
  const [showPassword, setShowPassword] = useState(false);

  function handleDelete(token: Token) {
    if (props.onDelete) {
      props.onDelete(token);
    }
  }

  function formatDates(isodate: string) {
    return new Date(isodate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Item variant="muted">
      <ItemContent>
        <span className="text-xs text-muted-foreground">
          {formatDates(props.token.created_at)}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {props.token.allow.map((allowed) => (
            <Badge variant="outline" className="text-xs">
              {allowLabels[allowed as Allow]}
            </Badge>
          ))}
        </div>
      </ItemContent>
      <ItemActions>
        <InputGroup>
          <InputGroupInput
            id="inline-end-input"
            type={showPassword ? "text" : "password"}
            value={props.token.value}
            readOnly
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Ocultar token" : "Mostrar token"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {props.onDelete && (
          <Button
            variant="destructive"
            size="icon"
            aria-label="Remover"
            onClick={() => handleDelete(props.token)}
          >
            <Trash />
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}
