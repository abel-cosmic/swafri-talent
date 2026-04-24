import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getTalents } from "@/actions/talent";
import { TalentTable } from "@/components/talent/talent-table";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

type SearchParams = Promise<{ search?: string; status?: "PENDING" | "APPROVED" | "REJECTED" }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const role = (session.user.role as string | undefined) ?? "user";
  const result = await getTalents({
    adminView: true,
    search: params.search,
    status: params.status,
  });
  const rows = result.data?.items ?? [];

  if (!can(role, "talent:list")) {
    return <p className="text-destructive">Access denied.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <TalentTable
        rows={rows as never}
        canApprove={can(role, "talent:approve")}
        canReject={can(role, "talent:reject")}
        canUpdate={can(role, "talent:update")}
        canDelete={can(role, "talent:delete")}
      />
    </div>
  );
}
