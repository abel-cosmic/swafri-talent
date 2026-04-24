import { TalentsListClient } from "@/components/talent/talents-list-client";

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function TalentsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? "";

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Approved Talent Profiles</h1>
      <TalentsListClient page={page} search={search} />
    </main>
  );
}
