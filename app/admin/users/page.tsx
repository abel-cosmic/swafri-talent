import { headers } from "next/headers";

import { listUsers } from "@/actions/users";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserTable } from "@/components/admin/user-table";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user?.role as string | undefined) ?? "user";
  if (!can(role, "userManagement:list")) return <p className="text-destructive">Access denied.</p>;

  const usersResult = await listUsers();
  const users = (usersResult.data?.users ?? []) as never[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      {can(role, "userManagement:create") ? <CreateUserForm /> : null}
      <UserTable
        rows={users as never}
        canSetRole={can(role, "userManagement:setRole")}
        canBan={can(role, "userManagement:ban")}
        canDelete={can(role, "userManagement:delete")}
      />
    </div>
  );
}
