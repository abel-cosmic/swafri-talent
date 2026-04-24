"use client";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserTable } from "@/components/admin/user-table";
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
  const { data, isLoading, isError } = useUsersQuery();

  return (
    <div className="space-y-5">
      {canCreate ? <CreateUserForm /> : null}
      {isLoading ? <p className="text-sm text-muted-foreground">Loading users...</p> : null}
      {isError ? <p className="text-destructive">Unable to load users.</p> : null}
      <UserTable rows={(data?.users ?? []) as never[]} canSetRole={canSetRole} canBan={canBan} canDelete={canDelete} />
    </div>
  )
}
