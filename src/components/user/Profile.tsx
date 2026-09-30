import { useState, useEffect } from "react";
import { UserRound, Mail, KeyRound, Gamepad2, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TokenItem } from "@/components/user/TokenItem";
import { type User, type Role, roleLabels } from "@/components/user/types";

export default function Profile() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const userData = document.getElementById("user-data");

    if (userData?.textContent) {
      setUser(JSON.parse(userData.textContent));
    }
  }, []);

  function getInitials(name: string): string {
    const words = name.split(/\s+/);
    if (words.length === 0 || words[0] === "") return "";

    const firstInitial = words[0].charAt(0);
    const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0) : "";

    return (firstInitial + lastInitial).toUpperCase();
  }

  return (
    user && (
      <>
        <div className="flex flex-col sm:flex-row justify-center items-center pb-12 gap-4 sm:gap-6">
          <Avatar className="size-24 shrink-0 ring-4 ring-primary shadow-lg">
            <AvatarFallback className="text-4xl font-bold uppercase">{getInitials(user.realname)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex justify-center sm:justify-start items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{user.realname}</h1>
              <Badge variant="default" className="capitalize">
                {roleLabels[user.role as Role]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Informações e tokens de acesso</p>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className="group flex items-start gap-4 rounded-xl p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <UserRound className="text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome de Usuário</p>
                <p>{user.username}</p>
              </div>
            </div>
            <div className="group flex items-start gap-4 rounded-xl p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <Mail className="text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p>{user.email}</p>
              </div>
            </div>
            <Separator className="my-2" />
            {user.steamid && (
              <div className="group flex items-start gap-4 rounded-xl p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-900">
                  <Gamepad2 className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Steam</p>
                  <a
                    href={`https://steamcommunity.com/profiles/${user.steamid}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold hover:underline"
                  >
                    {user.steamid}
                  </a>
                </div>
              </div>
            )}
            {user.youtubeid && (
              <div className="group flex items-start gap-4 rounded-xl p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-700">
                  <Play className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">YouTube</p>
                  <a
                    href={`https://www.youtube.com/@${user.youtubeid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold hover:underline"
                  >
                    {user.youtubeid}
                  </a>
                </div>
              </div>
            )}
            {(user.steamid || user.youtubeid) && <Separator className="my-2" />}
            <div className="group flex items-center gap-4 rounded-xl p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <KeyRound className="text-white" />
              </div>
              <h1 className="text-1xl font-bold">Tokens de Acesso</h1>
            </div>
            {user.tokens.map((token) => (
              <TokenItem key={token.value} token={token} variant="muted" />
            ))}
          </CardContent>
        </Card>
      </>
    )
  );
}
