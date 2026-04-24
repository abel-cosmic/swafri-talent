"use client"

import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/routes"

type AdminLoginValues = {
  email: string
  password: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const form = useForm<AdminLoginValues>({
    defaultValues: { email: "", password: "" },
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: AdminLoginValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message ?? "Login failed")
      return
    }

    router.replace(ROUTES.adminDashboard)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" /> : null}{isPending ? "Signing in..." : "Sign in"}</Button>
      </form>
    </Form>
  )
}
