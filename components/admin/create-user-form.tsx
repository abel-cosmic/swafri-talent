"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserMutations } from "@/lib/query-hooks";

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const { create } = useUserMutations();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await create.mutateAsync({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        role: String(formData.get("role") ?? "user"),
      });
      if (!result.success) toast.error(result.error ?? "Could not create user");
      else toast.success("User created");
    });
  }

  return (
    <form action={onSubmit} className="grid gap-2 rounded border p-4">
      <h2 className="font-medium">Create User</h2>
      <Label htmlFor="name">Name</Label>
      <Input id="name" name="name" required />
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" required />
      <Label htmlFor="password">Password</Label>
      <Input id="password" name="password" type="password" required />
      <Label htmlFor="role">Role</Label>
      <Input id="role" name="role" defaultValue="user" required />
      <Button disabled={isPending}>{isPending ? "Creating..." : "Create User"}</Button>
    </form>
  );
}
