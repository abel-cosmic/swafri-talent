import { TalentsListClient } from "@/components/talent/talents-list-client";
import { PageWrapper } from "@/components/layout/page-wrapper";

type TalentSearchParams = Promise<{ page?: string; search?: string; skill?: string; minYears?: string }>

export default async function TalentsPage({ searchParams }: { searchParams: TalentSearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const skill = params.skill ?? ""
  const minYearsValue = Number(params.minYears)
  const minYears = Number.isFinite(minYearsValue) ? minYearsValue : undefined

  return (
    <PageWrapper
      title="Approved Talent Profiles"
      description="Browse verified professionals, filter by name or skill, and open full profile details."
    >
      <TalentsListClient page={page} search={search} skill={skill} minYears={minYears} />
    </PageWrapper>
  )
}
