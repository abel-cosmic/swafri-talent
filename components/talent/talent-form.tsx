"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTalentMutations } from "@/lib/query-hooks";

export function TalentForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const { submit } = useTalentMutations();

  function onSubmit(formData: FormData) {
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      primarySkill: String(formData.get("primarySkill") ?? ""),
      yearsOfExperience: String(formData.get("yearsOfExperience") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    startTransition(async () => {
      const result = await submit.mutateAsync(payload);
      if (!result.success) {
        setSuccess(false);
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error ?? "Failed to submit talent profile.");
        return;
      }
      setErrors({});
      setSuccess(true);
      toast.success("Talent profile submitted.");
    });
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient) md:p-6">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input id="fullName" name="fullName" required />
        <p className="mt-1 text-sm text-destructive">{errors.fullName?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required />
        <p className="mt-1 text-sm text-destructive">{errors.email?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="primarySkill">Primary Skill *</Label>
        <Input id="primarySkill" name="primarySkill" required />
        <p className="mt-1 text-sm text-destructive">{errors.primarySkill?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
        <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min={0} required />
        <p className="mt-1 text-sm text-destructive">{errors.yearsOfExperience?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" required minLength={20} maxLength={500} />
        <p className="mt-1 text-sm text-destructive">{errors.description?.[0]}</p>
      </div>
      <Button size="lg" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
      {success ? (
        <p className="rounded-lg border border-(--cursor-success)/20 bg-(--cursor-success)/10 px-3 py-2 text-sm text-(--cursor-success)">
          Submission received. Your profile is pending review.
        </p>
      ) : null}
    </form>
  )
}
