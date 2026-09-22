import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, UserRound, LogOutIcon } from "lucide-react";
import type { User } from "./user/types";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  function getInitials(name: string): string {
    const words = name.split(/\s+/);
    if (words.length === 0 || words[0] === "") return "";

    const firstInitial = words[0].charAt(0);
    const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0) : "";

    return (firstInitial + lastInitial).toUpperCase();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}>
            <Avatar>
              <AvatarFallback>{getInitials(user.realname)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.realname}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem render={<a href="/profile" />}>
                <UserRound />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<a href="/logout" />}>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
