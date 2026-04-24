import Link from "next/link";
import type { TalentProfile } from "@/generated/prisma/browser";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routeBuilders } from "@/lib/routes/builders";

export function TalentCard({ talent }: { talent: TalentProfile }) {
  return (
    <Card className="h-full">
      {talent.profileImageUrl ? (
        <div className="aspect-[16/9] w-full overflow-hidden rounded-t-xl border-b border-border/70">
          <img src={talent.profileImageUrl} alt={`${talent.fullName} profile`} className="h-full w-full object-cover" />
        </div>
      ) : null}
      <CardHeader className="space-y-2">
        <CardTitle>
          <Link href={routeBuilders.talentDetail(talent.id)} className="transition-colors hover:text-destructive">
            {talent.fullName}
          </Link>
        </CardTitle>
        <p className="inline-flex w-fit rounded-full bg-muted px-3 py-1 font-display text-xs tracking-[0.04em] text-muted-foreground">
          {talent.primarySkill}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          <span className="font-display text-foreground">Experience:</span> {talent.yearsOfExperience} years
        </p>
        <p className="line-clamp-3 text-muted-foreground">{talent.description}</p>
        {talent.resumeUrl ? (
          <a href={talent.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex text-xs text-accent hover:underline">
            View Resume
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
