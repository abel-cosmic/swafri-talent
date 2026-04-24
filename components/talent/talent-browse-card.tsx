import Link from "next/link"
import type { TalentProfile } from "@/generated/prisma/browser"

import { Card, CardContent } from "@/components/ui/card"
import { routeBuilders } from "@/lib/routes/builders"
import { getTalentProfileImage } from "@/lib/talent-artwork"

export function TalentBrowseCard({ talent }: { talent: TalentProfile }) {
  const profileImage = getTalentProfileImage(talent.profileImageUrl)

  return (
    <Card className="h-full overflow-hidden border-border/80 bg-card/95">
      <div className="border-b border-border/70 bg-muted/20 p-3">
        <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-background/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profileImage} alt={`${talent.fullName} profile`} className="h-full w-full object-contain" />
        </div>
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Link
            href={routeBuilders.talentDetail(talent.id)}
            className="block text-lg font-semibold tracking-tight transition-colors hover:text-primary"
          >
            {talent.fullName}
          </Link>
          <p className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {talent.primarySkill}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Experience:</span> {talent.yearsOfExperience} years
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">{talent.description}</p>
        <div className="flex items-center justify-between gap-3">
          {talent.resumeUrl ? (
            <a href={talent.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline-offset-2 hover:underline">
              View Resume
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">No resume attached</span>
          )}
          <Link href={routeBuilders.talentDetail(talent.id)} className="text-xs font-medium text-primary underline-offset-2 hover:underline">
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
