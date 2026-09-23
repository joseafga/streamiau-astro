import * as React from "react";

import { NavMain } from "@/components/NavMain";
import { NavBottom } from "@/components/NavBottom";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowDown01, WholeWord, Settings2Icon, UsersRound, Code2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import type { User } from "./user/types";

const navigation = {
  main: [
    {
      title: "Contadores",
      url: "/counter",
      icon: <ArrowDown01 />,
      isActive: true,
    },
    {
      title: "Frases",
      url: "#",
      icon: <WholeWord />,
    },
    {
      title: "Configurações",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
  admin: [
    {
      title: "Usuários",
      url: "/admin/users",
      icon: <UsersRound />,
    },
  ],
  bottom: [
    {
      title: "Github",
      url: "https://github.com/joseafga/streamiau",
      icon: <Code2 />,
    },
  ],
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  title: string;
  user: User;
  children?: React.ReactNode;
}

export default function LayoutSidebar({ title, user, children, ...props }: Props) {
  function isAdmin() {
    return user.role === 0;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<a href="/home" />}>
                <div className="flex aspect-square size-10 [&_svg]:size-8 [&_svg]:shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo size={40} catClass="fill-mist-50" rectClass="fill-primary" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-streamiau font-extrabold uppercase text-xl">Streamiau!</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain label="Módulos" items={navigation.main} />
          {isAdmin() && <NavMain label="Administrador" items={navigation.admin} />}
          <NavBottom items={navigation.bottom} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
