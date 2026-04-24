import { TalentDetailClient } from "@/components/talent/talent-detail-client";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default async function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageWrapper title="Talent Profile" description="Public profile details for approved talent records.">
      <TalentDetailClient id={id} />
    </PageWrapper>
  )
}
