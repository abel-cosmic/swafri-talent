import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function HomePage() {
  return (
    <PageWrapper
      title="Talent Management System"
      description="Submit your talent profile, browse approved talent, and manage records through role-based admin tools."
      className="max-w-3xl"
    >
      <div className="mt-2 flex gap-3">
        <Button asChild>
          <Link href={ROUTES.submit}>Submit Profile</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.talents}>Browse Talent</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}
