import { TalentDetailClient } from "@/components/talent/talent-detail-client";

export default async function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <TalentDetailClient id={id} />
    </main>
  );
}
