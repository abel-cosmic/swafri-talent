import { notFound } from "next/navigation";
import { TalentStatus } from "@/generated/prisma/client";

import { getTalentById } from "@/actions/talent";

export default async function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const talent = await getTalentById(id);
  if (!talent || talent.status !== TalentStatus.APPROVED) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{talent.fullName}</h1>
      <p className="mt-4">
        <strong>Email:</strong> {talent.email}
      </p>
      <p>
        <strong>Primary Skill:</strong> {talent.primarySkill}
      </p>
      <p>
        <strong>Experience:</strong> {talent.yearsOfExperience} years
      </p>
      <p className="mt-4 whitespace-pre-wrap">{talent.description}</p>
    </main>
  );
}
