import Link from "next/link";
import { TalentStatus } from "@/generated/prisma/client";

import { getTalents } from "@/actions/talent";
import { TalentCard } from "@/components/talent/talent-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function TalentsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const result = await getTalents({ page, search, status: TalentStatus.APPROVED, adminView: false });
  const items = result.data?.items ?? [];
  const total = result.data?.total ?? 0;
  const hasNext = page * 10 < total;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Approved Talent Profiles</h1>
      <form className="my-4 flex gap-2">
        <Input name="search" defaultValue={search} placeholder="Search by name or skill" />
        <Button type="submit">Search</Button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((talent) => (
          <TalentCard key={talent.id as string} talent={talent as never} />
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        {page > 1 ? (
          <Button variant="outline" asChild>
            <Link href={`/talents?page=${page - 1}&search=${encodeURIComponent(search)}`}>Previous</Link>
          </Button>
        ) : null}
        {hasNext ? (
          <Button variant="outline" asChild>
            <Link href={`/talents?page=${page + 1}&search=${encodeURIComponent(search)}`}>Next</Link>
          </Button>
        ) : null}
      </div>
    </main>
  );
}
