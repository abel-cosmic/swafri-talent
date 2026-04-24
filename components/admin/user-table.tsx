"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { banUser, deleteUser, setUserRole } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  createdAt?: string | Date;
};

export function UserTable({
  rows,
  canSetRole,
  canBan,
  canDelete,
}: {
  rows: UserRecord[];
  canSetRole: boolean;
  canBan: boolean;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function doAction(fn: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      if (!result.success) toast.error(result.error ?? "Action failed");
      else toast.success("Action completed");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Banned</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Badge>{row.role ?? "user"}</Badge>
            </TableCell>
            <TableCell>{row.banned ? "Yes" : "No"}</TableCell>
            <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</TableCell>
            <TableCell className="space-x-2">
              {canSetRole ? (
                <form
                  className="inline-flex items-center gap-2"
                  action={(fd) =>
                    doAction(() =>
                      setUserRole({
                        userId: row.id,
                        role: String(fd.get("role") ?? "user") as "superAdmin" | "admin" | "moderator" | "user",
                      }),
                    )
                  }
                >
                  <Input name="role" placeholder="role" className="h-8 w-28" />
                  <Button size="sm" disabled={isPending}>
                    Set Role
                  </Button>
                </form>
              ) : null}
              {canBan ? (
                <Button size="sm" variant="outline" disabled={isPending} onClick={() => doAction(() => banUser({ userId: row.id }))}>
                  Ban
                </Button>
              ) : null}
              {canDelete ? (
                <Button size="sm" variant="destructive" disabled={isPending} onClick={() => doAction(() => deleteUser(row.id))}>
                  Delete
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
