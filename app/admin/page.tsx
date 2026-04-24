import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

type SearchParams = Promise<{ search?: string; status?: "PENDING" | "APPROVED" | "REJECTED" }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const role = (session.user.role as string | undefined) ?? "user";

  if (!can(role, "talent:list")) {
    return <p className="text-destructive">Access denied.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <AdminDashboardClient
        rolePermissions={{
          canApprove: can(role, "talent:approve"),
          canReject: can(role, "talent:reject"),
          canUpdate: can(role, "talent:update"),
          canDelete: can(role, "talent:delete"),
        }}
        search={params.search}
        status={params.status}
      />
    </div>
  );
}
