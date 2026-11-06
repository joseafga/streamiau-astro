import { useState, useEffect } from "react";
import { SquarePen, KeyRound, Trash, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ClearCacheButton from "@/components/users/ClearCacheButton";
import UserDialog from "@/components/users/UserDialog";
import TokensDialog from "@/components/users/TokensDialog";
import type { User } from "@/components/users/types";

export default function DataTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTokens, setOpenTokens] = useState(false);

  useEffect(() => {
    const usersData = document.getElementById("users-data");

    if (usersData?.textContent) {
      setUsers(JSON.parse(usersData.textContent));
    }
  }, []);

  function handleEdit(user: User) {
    setSelectedUser(user);
    setOpenEdit(true);
  }

  function handleTokens(user: User) {
    setSelectedUser(user);
    setOpenTokens(true);
  }

  function handleCreate(createdUser: User) {
    setUsers((prev) => [createdUser, ...prev]);
    setOpenNew(false);
  }

  function handleSave(updatedUser: User) {
    setUsers((prev) => prev.map((u) => (u.username === updatedUser.username ? updatedUser : u)));
    setOpenEdit(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground text-sm">{users.length} usuário(s)</p>
        </div>

        <div className="flex items-center justify-end gap-2">
          <ClearCacheButton />
          <Button onClick={() => setOpenNew(true)}>
            <Plus />
            Novo Usuário
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-muted-foreground">Usuário</TableHead>
            <TableHead className="font-bold text-muted-foreground">Nome</TableHead>
            <TableHead className="font-bold text-muted-foreground">Email</TableHead>
            <TableHead className="font-bold text-muted-foreground">Cargo</TableHead>
            <TableHead className="font-bold text-muted-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.username}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.realname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => handleEdit(user)}>
                  <SquarePen />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Tokens" onClick={() => handleTokens(user)}>
                  <KeyRound />
                </Button>
                <Button variant="destructive" size="icon" aria-label="Submit">
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserDialog open={openNew} setOpen={setOpenNew} onSave={handleCreate} />
      <UserDialog open={openEdit} setOpen={setOpenEdit} user={selectedUser} onSave={handleSave} />
      <TokensDialog open={openTokens} setOpen={setOpenTokens} user={selectedUser} onSave={handleSave} />
    </>
  );
}
