"use client";

import { useState } from "react";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserTable } from "@/components/admin/user-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUsersQuery } from "@/lib/query-hooks";

export function AdminUsersClient({
  canCreate,
  canSetRole,
  canBan,
  canDelete,
}: {
  canCreate: boolean;
  canSetRole: boolean;
  canBan: boolean;
  canDelete: boolean;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, isError } = useUsersQuery();

  return (
    <div className="space-y-5">
      {canCreate ? (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>Create a new team account and assign the initial role.</DialogDescription>
            </DialogHeader>
            <CreateUserForm mode="dialog" onCreated={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      ) : null}
      {isLoading ? <p className="text-sm text-muted-foreground">Loading users...</p> : null}
      {isError ? <p className="text-destructive">Unable to load users.</p> : null}
      <UserTable rows={(data?.users ?? []) as never[]} canSetRole={canSetRole} canBan={canBan} canDelete={canDelete} />
    </div>
  )
}
