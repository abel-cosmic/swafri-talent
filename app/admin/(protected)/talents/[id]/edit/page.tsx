import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getTalentById } from "@/actions/talent";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { EditTalentForm } from "@/components/talent/edit-talent-form";
import { auth } from "@/lib/auth";
import { can } from "@/lib/role-permissions";

export default async function AdminEditTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user?.role as string | undefined) ?? "user";
  if (!can(role, "talent:update")) return <p className="text-destructive">Access denied.</p>;

  const talent = await getTalentById(id);
  if (!talent) notFound();

  return (
    <PageWrapper
      title="Edit Talent"
      description="Adjust profile details and moderation status while preserving consistent directory quality."
      className="max-w-2xl"
    >
      <EditTalentForm talent={talent} />
    </PageWrapper>
  )
}
