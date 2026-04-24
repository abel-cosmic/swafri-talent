"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { submitTalent } from "@/actions/talent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TalentForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  function onSubmit(formData: FormData) {
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      primarySkill: String(formData.get("primarySkill") ?? ""),
      yearsOfExperience: String(formData.get("yearsOfExperience") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    startTransition(async () => {
      const result = await submitTalent(payload);
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
    <form action={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input id="fullName" name="fullName" required />
        <p className="text-sm text-destructive">{errors.fullName?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required />
        <p className="text-sm text-destructive">{errors.email?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="primarySkill">Primary Skill *</Label>
        <Input id="primarySkill" name="primarySkill" required />
        <p className="text-sm text-destructive">{errors.primarySkill?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
        <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min={0} required />
        <p className="text-sm text-destructive">{errors.yearsOfExperience?.[0]}</p>
      </div>
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" required minLength={20} maxLength={500} />
        <p className="text-sm text-destructive">{errors.description?.[0]}</p>
      </div>
      <Button disabled={isPending}>{isPending ? "Submitting..." : "Submit"}</Button>
      {success ? <p className="text-sm text-green-600">Submission received. Your profile is pending review.</p> : null}
    </form>
  );
}
