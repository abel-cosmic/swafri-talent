"use client";

import { type TalentProfile } from "@/generated/prisma/browser";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTalentMutations } from "@/lib/query-hooks";
import { ROUTES } from "@/lib/routes";

export function EditTalentForm({ talent }: { talent: TalentProfile }) {
  const [isPending, startTransition] = useTransition();
  const [statusValue, setStatusValue] = useState<"PENDING" | "APPROVED" | "REJECTED">(talent.status);
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
      router.push(ROUTES.adminDashboard);
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient) md:p-6">
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
        <input type="hidden" name="status" value={statusValue} />
        <Select value={statusValue} onValueChange={(value) => setStatusValue(value as "PENDING" | "APPROVED" | "REJECTED")}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="APPROVED">APPROVED</SelectItem>
            <SelectItem value="REJECTED">REJECTED</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button size="lg" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
