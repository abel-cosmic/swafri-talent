import { TalentsListClient } from "@/components/talent/talents-list-client";
import { PageWrapper } from "@/components/layout/page-wrapper";

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function TalentsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? "";

  return (
    <PageWrapper title="Approved Talent Profiles" className="max-w-5xl">
      <TalentsListClient page={page} search={search} />
    </PageWrapper>
  );
}
