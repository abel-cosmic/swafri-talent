"use client";

import { type TalentProfile } from "@/generated/prisma/client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTalentMutations } from "@/lib/query-hooks";

export function EditTalentForm({ talent }: { talent: TalentProfile }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useTalentMutations();

  function onSubmit(formData: FormData) {
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      primarySkill: String(formData.get("primarySkill") ?? ""),
      yearsOfExperience: String(formData.get("yearsOfExperience") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "PENDING"),
    };
    startTransition(async () => {
      const result = await update.mutateAsync({ id: talent.id, payload });
      if (!result.success) {
        toast.error(result.error ?? "Update failed.");
        return;
      }
      toast.success("Talent profile updated.");
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" defaultValue={talent.fullName} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" defaultValue={talent.email} required />
      </div>
      <div>
        <Label htmlFor="primarySkill">Primary Skill</Label>
        <Input id="primarySkill" name="primarySkill" defaultValue={talent.primarySkill} required />
      </div>
      <div>
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Input id="yearsOfExperience" name="yearsOfExperience" type="number" defaultValue={talent.yearsOfExperience} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={talent.description} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={talent.status} className="w-full rounded-md border p-2">
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>
      <Button disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</Button>
    </form>
  );
}
