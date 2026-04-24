"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserMutations } from "@/lib/query-hooks"

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState("user")
  const { create } = useUserMutations()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await create.mutateAsync({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        role: String(formData.get("role") ?? "user"),
      })
      if (!result.success) toast.error(result.error ?? "Could not create user")
      else toast.success("User created")
    })
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient)">
      <h2 className="font-display text-display-md">Create User</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <input type="hidden" name="role" value={role} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">user</SelectItem>
            <SelectItem value="moderator">moderator</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
            <SelectItem value="superAdmin">superAdmin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button disabled={isPending}>{isPending ? "Creating..." : "Create User"}</Button>
    </form>
  )
}
