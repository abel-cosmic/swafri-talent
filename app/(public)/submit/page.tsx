import { TalentForm } from "@/components/talent/talent-form";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function SubmitPage() {
  return (
    <PageWrapper
      title="Submit Your Talent Profile"
      description="All fields are required and reviewed by moderators."
      className="max-w-2xl"
    >
      <TalentForm />
    </PageWrapper>
  );
}
