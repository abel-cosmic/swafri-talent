"use client";

import Link from "next/link";
import { TalentStatus, type TalentProfile } from "@/generated/prisma/client";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTalentMutations } from "@/lib/query-hooks";

function StatusBadge({ status }: { status: TalentStatus }) {
  if (status === "APPROVED") return <Badge className="bg-green-100 text-green-800">APPROVED</Badge>;
  if (status === "REJECTED") return <Badge className="bg-red-100 text-red-800">REJECTED</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
}

export function TalentTable({
  rows,
  canApprove,
  canReject,
  canUpdate,
  canDelete,
}: {
  rows: TalentProfile[];
  canApprove: boolean;
  canReject: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { approve, reject, remove } = useTalentMutations();

  function runAction(handler: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await handler();
      if (!res.success) toast.error(res.error ?? "Action failed.");
      else toast.success("Action completed.");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Primary Skill</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.fullName}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.primarySkill}</TableCell>
            <TableCell>{row.yearsOfExperience}</TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="space-x-2">
              {canApprove ? (
                <Button size="sm" disabled={isPending} onClick={() => runAction(() => approve.mutateAsync(row.id))}>
                  Approve
                </Button>
              ) : null}
              {canReject ? (
                <Button size="sm" variant="outline" disabled={isPending} onClick={() => runAction(() => reject.mutateAsync(row.id))}>
                  Reject
                </Button>
              ) : null}
              {canUpdate ? (
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/admin/talents/${row.id}/edit`}>Edit</Link>
                </Button>
              ) : null}
              {canDelete ? (
                <Button size="sm" variant="destructive" disabled={isPending} onClick={() => runAction(() => remove.mutateAsync(row.id))}>
                  Delete
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
