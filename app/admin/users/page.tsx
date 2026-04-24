import { headers } from "next/headers";

import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user?.role as string | undefined) ?? "user";
  if (!can(role, "userManagement:list")) return <p className="text-destructive">Access denied.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <AdminUsersClient
        canCreate={can(role, "userManagement:create")}
        canSetRole={can(role, "userManagement:setRole")}
        canBan={can(role, "userManagement:ban")}
        canDelete={can(role, "userManagement:delete")}
      />
    </div>
  );
}
