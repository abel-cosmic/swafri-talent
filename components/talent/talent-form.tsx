"use client"

import { CheckCircle2, LoaderCircle, Upload } from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTalentMutations } from "@/lib/query-hooks"
import { UploadButton } from "@/lib/uploadthing"

type TalentFormValues = {
  fullName: string
  email: string
  primarySkill: string
  yearsOfExperience: number
  description: string
  profileImageUrl?: string
  resumeUrl?: string
  resumeFileName?: string
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

export function TalentForm() {
  const [success, setSuccess] = useState(false)
  const { submit } = useTalentMutations()
  const form = useForm<TalentFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      primarySkill: "",
      yearsOfExperience: 0,
      description: "",
      profileImageUrl: "",
      resumeUrl: "",
      resumeFileName: "",
    },
  })
  const uploadedProfileImage = useWatch({ control: form.control, name: "profileImageUrl" })
  const uploadedResumeName = useWatch({ control: form.control, name: "resumeFileName" })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: TalentFormValues) {
    setSuccess(false)
    const result = await submit.mutateAsync(values)

    if (!result.success) {
      const fieldErrors = result.fieldErrors ?? {}
      for (const [field, messages] of Object.entries(fieldErrors)) {
        const message = messages?.[0]
        if (!message) {
          continue
        }
        form.setError(field as keyof TalentFormValues, { type: "server", message })
      }
      toast.error(result.error ?? "Failed to submit talent profile.")
      return
    }

    form.reset()
    setSuccess(true)
    toast.success("Talent profile submitted.")
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
              <FormLabel>Full Name *</FormLabel>
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
              <FormLabel>Email *</FormLabel>
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
              <FormLabel>Primary Skill *</FormLabel>
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
              <FormLabel>Years Of Experience *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value ?? 0}
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea {...field} minLength={20} maxLength={500} />
              </FormControl>
              <FormDescription>Highlight your strengths, projects, and outcomes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileImageUrl"
          render={() => (
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
              {uploadedProfileImage ? (
                <p className="text-xs text-muted-foreground">Image uploaded and ready.</p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resumeUrl"
          render={() => (
            <FormItem>
              <FormLabel>Resume Upload (PDF)</FormLabel>
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
              {uploadedResumeName ? (
                <p className="text-xs text-muted-foreground">Uploaded: {uploadedResumeName}</p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="lg" disabled={isPending} className="min-w-36">
          {isPending ? <LoaderCircle className="animate-spin" /> : <Upload />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
        {success ? (
          <div className="animate-in fade-in zoom-in-95 rounded-lg border border-(--cursor-success)/20 bg-(--cursor-success)/10 px-3 py-2 text-sm text-(--cursor-success)">
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Submission received. Your profile is pending review.
            </p>
          </div>
        ) : null}
      </form>
    </Form>
  )
}
