import Link from "next/link";

import { getTalents } from "@/actions/talent";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default async function HomePage() {
  const talentsResult = await getTalents({ pageSize: 8, adminView: false })
  const talents = talentsResult.success ? talentsResult.data?.items ?? [] : []
  const marqueeItems = talents.length ? [...talents, ...talents] : []

  return (
    <PageWrapper
      title="Discover and Manage Talent with Confidence"
      description="A warm, modern workspace to submit profiles, explore approved professionals, and run role-based operations without friction."
    >
      <div className="grid gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient) sm:grid-cols-2 sm:p-6">
        <div className="space-y-2 sm:col-span-2">
          <p className="font-display text-display-md">Built for fast submissions and clean review flows.</p>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Keep every interaction simple: profile creation, approvals, and browsing all share one polished system.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href={ROUTES.submit}>Submit Profile</Link>
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <Link href={ROUTES.talents}>Browse Talent</Link>
        </Button>
      </div>
      <section className="space-y-3 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient) sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-display-md">Featured Talent</h2>
          <p className="text-sm text-muted-foreground">Fresh profiles moving across the spotlight lane.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/40 p-3">
          {marqueeItems.length ? (
            <div className="marquee-track flex gap-3">
              {marqueeItems.map((talent, index) => (
                <article
                  key={`${talent.id}-${index}`}
                  className="w-[260px] shrink-0 rounded-lg border border-border/70 bg-background p-3"
                >
                  <div className="mb-3 h-32 overflow-hidden rounded-md bg-muted">
                    {talent.profileImageUrl ? (
                      <img src={talent.profileImageUrl} alt={`${talent.fullName} profile`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image yet</div>
                    )}
                  </div>
                  <p className="font-display text-sm">{talent.fullName}</p>
                  <p className="text-xs text-muted-foreground">{talent.primarySkill}</p>
                  <Button variant="link" size="sm" className="mt-1 px-0" asChild>
                    <Link href={`/talents/${talent.id}`}>View profile</Link>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No approved talent to showcase yet.</p>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
