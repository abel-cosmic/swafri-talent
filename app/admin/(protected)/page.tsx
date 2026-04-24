import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { can } from "@/lib/role-permissions";

type SearchParams = Promise<{ search?: string; status?: "PENDING" | "APPROVED" | "REJECTED" }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(ROUTES.adminLogin);

  const role = (session.user.role as string | undefined) ?? "user";

  if (!can(role, "talent:list")) {
    return <p className="text-destructive">Access denied.</p>;
  }

  return (
    <PageWrapper title="Admin Dashboard">
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
    </PageWrapper>
  );
}
