"use client";

import { TalentStatus } from "@/generated/prisma/browser";
import { useTalentDetailQuery } from "@/lib/query-hooks";
import { getTalentProfileImage } from "@/lib/talent-artwork";

export function TalentDetailClient({ id }: { id: string }) {
  const { data: talent, isLoading } = useTalentDetailQuery(id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  if (!talent || talent.status !== TalentStatus.APPROVED) {
    return <p className="text-destructive">Talent profile not found.</p>
  }

  const profileImage = getTalentProfileImage(talent.profileImageUrl)

  return (
    <article className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-7">
      <div className="overflow-hidden rounded-xl border border-border/80">
        <img src={profileImage} alt={`${talent.fullName} profile`} className="h-64 w-full object-cover" />
      </div>
      <header className="space-y-2">
        <h2 className="font-display text-display-md">{talent.fullName}</h2>
        <p className="font-editorial text-muted-foreground">{talent.primarySkill}</p>
      </header>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-muted p-3">
          <dt className="font-display text-xs tracking-[0.04em] text-muted-foreground">Email</dt>
          <dd className="mt-1 text-foreground">{talent.email}</dd>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <dt className="font-display text-xs tracking-[0.04em] text-muted-foreground">Experience</dt>
          <dd className="mt-1 text-foreground">{talent.yearsOfExperience} years</dd>
        </div>
      </dl>
      <section className="rounded-lg bg-background/80 p-4">
        <h3 className="font-display text-sm tracking-[0.03em] text-muted-foreground">About</h3>
        <p className="mt-2 whitespace-pre-wrap text-foreground/90">{talent.description}</p>
      </section>
      {talent.resumeUrl ? (
        <section className="rounded-lg bg-background/80 p-4">
          <h3 className="font-display text-sm tracking-[0.03em] text-muted-foreground">Resume</h3>
          <a href={talent.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-accent hover:underline">
            {talent.resumeFileName ?? "Open uploaded resume"}
          </a>
        </section>
      ) : null}
    </article>
  )
}
