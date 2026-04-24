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
    <>
      {canCreate ? <CreateUserForm /> : null}
      {isLoading ? <p>Loading users...</p> : null}
      {isError ? <p className="text-destructive">Unable to load users.</p> : null}
      <UserTable rows={(data?.users ?? []) as never[]} canSetRole={canSetRole} canBan={canBan} canDelete={canDelete} />
    </>
  );
}
