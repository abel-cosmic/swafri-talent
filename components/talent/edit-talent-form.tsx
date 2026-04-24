"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { type TalentProfile } from "@/generated/prisma/browser"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"
import { useTalentMutations } from "@/lib/query-hooks"
import { ROUTES } from "@/lib/routes"
import { talentUpdateSchema } from "@/lib/schemas"
import { UploadButton } from "@/lib/uploadthing"

type EditTalentFormValues = z.input<typeof talentUpdateSchema> & {
  status: "PENDING" | "APPROVED" | "REJECTED"
}

type UploadedFile = {
  name?: string
  ufsUrl?: string
  url?: string
  serverData?: {
    name?: string
    url?: string
  }
}

function normalizeUploadedFile(file: UploadedFile | undefined) {
  return {
    url: file?.serverData?.url ?? file?.ufsUrl ?? file?.url ?? "",
    name: file?.serverData?.name ?? file?.name ?? "",
  }
}

export function EditTalentForm({ talent }: { talent: TalentProfile }) {
  const router = useRouter()
  const { update } = useTalentMutations()
  const form = useForm<EditTalentFormValues>({
    resolver: zodResolver(talentUpdateSchema.extend({ status: z.enum(["PENDING", "APPROVED", "REJECTED"]) })),
    defaultValues: {
      fullName: talent.fullName,
      email: talent.email,
      primarySkill: talent.primarySkill,
      yearsOfExperience: talent.yearsOfExperience,
      description: talent.description,
      status: talent.status,
      profileImageUrl: talent.profileImageUrl ?? "",
      resumeUrl: talent.resumeUrl ?? "",
      resumeFileName: talent.resumeFileName ?? "",
    },
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: EditTalentFormValues) {
    const result = await update.mutateAsync({ id: talent.id, payload: values })
    if (!result.success) {
      toast.error(result.error ?? "Update failed.")
      return
    }
    toast.success("Talent profile updated.")
    router.push(ROUTES.adminDashboard)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-(--cursor-shadow-ambient) md:p-6"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
          name="primarySkill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skill</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years Of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <UploadButton
            endpoint="talentImageUploader"
            className="ut-button:bg-secondary ut-button:text-secondary-foreground ut-label:text-muted-foreground"
            onClientUploadComplete={(files) => {
              const image = normalizeUploadedFile(files[0] as UploadedFile | undefined)
              if (!image.url) {
                toast.error("Image upload failed.")
                return
              }
              form.setValue("profileImageUrl", image.url, { shouldValidate: true })
              toast.success("Profile image uploaded.")
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message)
            }}
          />
          {form.watch("profileImageUrl") ? <p className="text-xs text-muted-foreground">Image uploaded.</p> : null}
        </FormItem>
        <FormItem>
          <FormLabel>Resume (PDF)</FormLabel>
          <UploadButton
            endpoint="talentResumeUploader"
            className="ut-button:bg-secondary ut-button:text-secondary-foreground ut-label:text-muted-foreground"
            onClientUploadComplete={(files) => {
              const resume = normalizeUploadedFile(files[0] as UploadedFile | undefined)
              if (!resume.url) {
                toast.error("Resume upload failed.")
                return
              }
              form.setValue("resumeUrl", resume.url, { shouldValidate: true })
              form.setValue("resumeFileName", resume.name, { shouldValidate: true })
              toast.success("Resume uploaded.")
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message)
            }}
          />
          {form.watch("resumeFileName") ? (
            <p className="text-xs text-muted-foreground">Uploaded: {form.watch("resumeFileName")}</p>
          ) : null}
        </FormItem>
        <Button size="lg" disabled={isPending}>
          {isPending ? <LoaderCircle className="animate-spin" /> : null}
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  )
}
