import { TalentForm } from "@/components/talent/talent-form";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function SubmitPage() {
  return (
    <PageWrapper
      title="Submit Your Talent Profile"
      description="Share your profile details for moderation. Every field helps teams match your strengths faster."
    >
      <TalentForm />
    </PageWrapper>
  )
}
