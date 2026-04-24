"use client";

import { TalentStatus } from "@/generated/prisma/browser";

import { TalentTable } from "@/components/talent/talent-table";
import { useTalentsQuery } from "@/lib/query-hooks";

export function AdminDashboardClient({
  rolePermissions,
  search,
  status,
}: {
  rolePermissions: { canApprove: boolean; canReject: boolean; canUpdate: boolean; canDelete: boolean };
  search?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const { data, isLoading, isError } = useTalentsQuery({
    adminView: true,
    search,
    status: status as TalentStatus | undefined,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading admin talents...</p>;
  if (isError) return <p className="text-destructive">Unable to load talent records.</p>;

  return (
    <div className="space-y-4">
      <p className="font-editorial text-muted-foreground">Review submissions, change status, and keep records up to date.</p>
      <TalentTable
        rows={data?.items ?? []}
        canApprove={rolePermissions.canApprove}
        canReject={rolePermissions.canReject}
        canUpdate={rolePermissions.canUpdate}
        canDelete={rolePermissions.canDelete}
      />
    </div>
  )
}
