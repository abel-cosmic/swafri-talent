import { TalentsListClient } from "@/components/talent/talents-list-client";
import { PageWrapper } from "@/components/layout/page-wrapper";

type TalentSearchParams = Promise<{
  page?: string
  search?: string
  skill?: string
  minYears?: string
  maxYears?: string
  hasResume?: string
  hasImage?: string
  sortBy?: string
}>

export default async function TalentsPage({ searchParams }: { searchParams: TalentSearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? ""
  const skill = params.skill ?? ""
  const minYearsValue = Number(params.minYears)
  const maxYearsValue = Number(params.maxYears)
  const minYears = Number.isFinite(minYearsValue) ? minYearsValue : undefined
  const maxYears = Number.isFinite(maxYearsValue) ? maxYearsValue : undefined
  const hasResume = params.hasResume === "true" ? true : params.hasResume === "false" ? false : undefined
  const hasImage = params.hasImage === "true" ? true : params.hasImage === "false" ? false : undefined
  const sortBy = params.sortBy ?? "newest"

  return (
    <PageWrapper
      title="Approved Talent Profiles"
      description="Browse verified professionals with structured filters for skill, experience, assets, and sort order."
    >
      <TalentsListClient
        page={page}
        search={search}
        skill={skill}
        minYears={minYears}
        maxYears={maxYears}
        hasResume={hasResume}
        hasImage={hasImage}
        sortBy={sortBy}
      />
    </PageWrapper>
  )
}
