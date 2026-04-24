"use client";

import Link from "next/link";
import { TalentStatus } from "@/generated/prisma/browser";

import { TalentCard } from "@/components/talent/talent-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTalentsQuery } from "@/lib/query-hooks";
import { routeBuilders } from "@/lib/routes/builders";

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
      <form className="my-4 flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-3 shadow-(--cursor-shadow-ambient) sm:flex-row">
        <Input name="search" defaultValue={search} placeholder="Search by name or skill" className="sm:flex-1" />
        <Button type="submit">Search</Button>
      </form>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading talents...</p> : null}
      {isError ? <p className="text-destructive">Failed to load talents.</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>
      <div className="mt-7 flex gap-3">
        {page > 1 ? (
          <Button variant="secondary" asChild>
            <Link href={routeBuilders.talentsList({ page: page - 1, search })}>Previous</Link>
          </Button>
        ) : null}
        {hasNext ? (
          <Button variant="secondary" asChild>
            <Link href={routeBuilders.talentsList({ page: page + 1, search })}>Next</Link>
          </Button>
        ) : null}
      </div>
    </>
  )
}
