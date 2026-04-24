import { TalentForm } from "@/components/talent/talent-form";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Submit Your Talent Profile</h1>
      <p className="mb-6 mt-2 text-muted-foreground">All fields are required and reviewed by moderators.</p>
      <TalentForm />
    </main>
  );
}
