"use client";

import Link from "next/link";
import { TalentStatus } from "@/generated/prisma/client";

import { TalentCard } from "@/components/talent/talent-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTalentsQuery } from "@/lib/query-hooks";

export function TalentsListClient({ page, search }: { page: number; search: string }) {
  const { data, isLoading, isError } = useTalentsQuery({
    page,
    search,
    status: TalentStatus.APPROVED,
    adminView: false,
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasNext = page * 10 < total;

  return (
    <>
      <form className="my-4 flex gap-2">
        <Input name="search" defaultValue={search} placeholder="Search by name or skill" />
        <Button type="submit">Search</Button>
      </form>
      {isLoading ? <p>Loading talents...</p> : null}
      {isError ? <p className="text-destructive">Failed to load talents.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
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
    </>
  );
}
