"use client"

import { useUploadFile } from "@better-upload/client"
import { CheckCircle2, FileUp, ImagePlus, LoaderCircle, Upload } from "lucide-react"
import { useRef, useState } from "react"
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
import { resolveUploadedFileUrl } from "@/lib/uploads"

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

export function TalentForm() {
  const [success, setSuccess] = useState(false)
  const { submit } = useTalentMutations()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
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
  const imageUploader = useUploadFile({
    api: "/api/upload",
    route: "talentImage",
    onUploadComplete: ({ file }) => {
      const fileUrl = resolveUploadedFileUrl(file.objectInfo.key)
      if (!fileUrl) {
        toast.error("Image upload failed.")
        return
      }
      form.setValue("profileImageUrl", fileUrl, { shouldValidate: true })
      toast.success("Profile image uploaded.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const resumeUploader = useUploadFile({
    api: "/api/upload",
    route: "talentResume",
    onUploadComplete: ({ file }) => {
      const fileUrl = resolveUploadedFileUrl(file.objectInfo.key)
      if (!fileUrl) {
        toast.error("Resume upload failed.")
        return
      }
      form.setValue("resumeUrl", fileUrl, { shouldValidate: true })
      form.setValue("resumeFileName", file.name, { shouldValidate: true })
      toast.success("Resume uploaded.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

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
        className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6"
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
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="profileImageUrl"
            render={() => (
              <FormItem className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <FormLabel>Profile Picture</FormLabel>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.currentTarget.files?.[0]
                    if (!file) {
                      return
                    }
                    await imageUploader.upload(file)
                    event.currentTarget.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full"
                  disabled={imageUploader.isPending}
                  onClick={() => imageInputRef.current?.click()}
                >
                  {imageUploader.isPending ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
                  {imageUploader.isPending ? "Uploading image..." : "Choose image"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {uploadedProfileImage ? "Image uploaded and ready." : "JPG or PNG recommended."}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resumeUrl"
            render={() => (
              <FormItem className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <FormLabel>Resume Upload (PDF)</FormLabel>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.currentTarget.files?.[0]
                    if (!file) {
                      return
                    }
                    await resumeUploader.upload(file)
                    event.currentTarget.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full"
                  disabled={resumeUploader.isPending}
                  onClick={() => resumeInputRef.current?.click()}
                >
                  {resumeUploader.isPending ? <LoaderCircle className="animate-spin" /> : <FileUp />}
                  {resumeUploader.isPending ? "Uploading resume..." : "Choose resume"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {uploadedResumeName ? `Uploaded: ${uploadedResumeName}` : "Attach a PDF resume (optional)."}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
