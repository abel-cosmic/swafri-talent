import { headers } from "next/headers";

import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user?.role as string | undefined) ?? "user";
  if (!can(role, "userManagement:list")) return <p className="text-destructive">Access denied.</p>;

  return (
    <PageWrapper
      title="User Management"
      description="Create users, update roles, and enforce moderation controls from one central dashboard."
    >
      <AdminUsersClient
        canCreate={can(role, "userManagement:create")}
        canSetRole={can(role, "userManagement:setRole")}
        canBan={can(role, "userManagement:ban")}
        canDelete={can(role, "userManagement:delete")}
      />
    </PageWrapper>
  )
}
