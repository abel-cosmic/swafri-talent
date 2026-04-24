import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold">Talent Management System</h1>
      <p className="mt-3 text-muted-foreground">
        Submit your talent profile, browse approved talent, and manage records through role-based admin tools.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/submit">Submit Profile</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/talents">Browse Talent</Link>
        </Button>
      </div>
    </main>
  );
}
