"use client"

import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserMutations } from "@/lib/query-hooks"

type CreateUserValues = {
  name: string
  email: string
  password: string
  role: "user" | "moderator" | "admin" | "superAdmin"
}

export function CreateUserForm({
  mode = "card",
  onCreated,
}: {
  mode?: "card" | "dialog"
  onCreated?: () => void
}) {
  const { create } = useUserMutations()
  const form = useForm<CreateUserValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: CreateUserValues) {
    const result = await create.mutateAsync(values)
    if (!result.success) {
      toast.error(result.error ?? "Could not create user")
      return
    }

    form.reset({ name: "", email: "", password: "", role: "user" })
    toast.success("User created")
    onCreated?.()
  }

  const isDialog = mode === "dialog"

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={isDialog ? "grid gap-4" : "grid gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient)"}
      >
        {!isDialog ? <h2 className="font-display text-display-md">Create User</h2> : null}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">user</SelectItem>
                  <SelectItem value="moderator">moderator</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="superAdmin">superAdmin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" /> : null}{isPending ? "Creating..." : "Create User"}</Button>
      </form>
    </Form>
  )
}
