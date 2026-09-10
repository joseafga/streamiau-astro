import * as React from "react";
import { cn } from "cn";
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

interface Props extends React.ComponentProps<typeof Item> {
  token: Token;
  onDelete?: (token: Token) => void;
}

function TokenItem({ className, token, onDelete, ...props }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);

  function handleDelete(token: Token) {
    if (onDelete) {
      onDelete(token);
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
    <Item className={cn(className)} {...props}>
      <ItemContent>
        <span className="text-xs text-muted-foreground">
          {formatDates(token.created_at)}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {token.allow.map((allowed, index) => (
            <Badge key={allowed} variant="outline" className="text-xs">
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
            value={token.value}
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
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            aria-label="Remover"
            onClick={() => handleDelete(token)}
          >
            <Trash />
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}

export { TokenItem };
