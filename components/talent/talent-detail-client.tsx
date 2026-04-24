"use client";

import { TalentStatus } from "@/generated/prisma/browser";
import { useTalentDetailQuery } from "@/lib/query-hooks";

export function TalentDetailClient({ id }: { id: string }) {
  const { data: talent, isLoading } = useTalentDetailQuery(id);

  if (isLoading) return <p>Loading profile...</p>;
  if (!talent || talent.status !== TalentStatus.APPROVED) {
    return <p className="text-destructive">Talent profile not found.</p>;
  }

  return (
    <>
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
    </>
  );
}
