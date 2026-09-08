import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SquarePen, KeyRound, Trash } from "lucide-react";
import UserEditDialog from "./UserEditDialog";
import UserTokensDialog from "./UserTokensDialog";
import type { User } from "./types";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTokens, setOpenTokens] = useState(false);

  useEffect(() => {
    const userData = document.getElementById("users-data");

    if (userData?.textContent) {
      setUsers(JSON.parse(userData.textContent));
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

  function handleSave(updatedUser: User) {
    setUsers((prev) =>
      prev.map((u) => (u._id.$oid === updatedUser._id.$oid ? updatedUser : u)),
    );
    setOpenEdit(false);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-muted-foreground">
              Usuário
            </TableHead>
            <TableHead className="font-bold text-muted-foreground">
              Nome
            </TableHead>
            <TableHead className="font-bold text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="font-bold text-muted-foreground">
              Cargo
            </TableHead>
            <TableHead className="font-bold text-muted-foreground text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id.$oid}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.realname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Editar"
                  onClick={() => handleEdit(user)}
                >
                  <SquarePen />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Tokens"
                  onClick={() => handleTokens(user)}
                >
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
      <UserEditDialog
        open={openEdit}
        setOpen={setOpenEdit}
        user={selectedUser}
        onSave={handleSave}
      />
      <UserTokensDialog
        open={openTokens}
        setOpen={setOpenTokens}
        user={selectedUser}
      />
    </>
  );
}
