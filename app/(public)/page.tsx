import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function HomePage() {
  return (
    <PageWrapper
      title="Discover and Manage Talent with Confidence"
      description="A warm, modern workspace to submit profiles, explore approved professionals, and run role-based operations without friction."
      className="max-w-4xl"
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
    </PageWrapper>
  )
}
