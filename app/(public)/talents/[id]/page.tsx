import { TalentDetailClient } from "@/components/talent/talent-detail-client";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default async function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageWrapper title="Talent Profile" className="max-w-3xl">
      <TalentDetailClient id={id} />
    </PageWrapper>
  );
}
