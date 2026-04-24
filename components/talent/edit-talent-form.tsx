"use client"

import { FileUp, ImagePlus, LoaderCircle } from "lucide-react"
import { type TalentProfile } from "@/generated/prisma/browser"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { useTalentMutations } from "@/lib/query-hooks"
import { ROUTES } from "@/lib/routes"
import { useUploadThing } from "@/lib/uploadthing"
import { resolveUploadedFileUrl } from "@/lib/uploads"

type EditTalentFormValues = {
  fullName?: string
  email?: string
  primarySkill?: string
  yearsOfExperience?: number
  description?: string
  profileImageUrl?: string
  resumeUrl?: string
  resumeFileName?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export function EditTalentForm({ talent }: { talent: TalentProfile }) {
  const router = useRouter()
  const { update } = useTalentMutations()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const form = useForm<EditTalentFormValues>({
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
  const uploadedProfileImage = useWatch({ control: form.control, name: "profileImageUrl" })
  const uploadedResumeName = useWatch({ control: form.control, name: "resumeFileName" })
  const uploadedResumeUrl = useWatch({ control: form.control, name: "resumeUrl" })
  const imageUploader = useUploadThing("talentImageUploader", {
    onClientUploadComplete: (files) => {
      const uploadedFile = files[0]
      const fileUrl =
        uploadedFile?.ufsUrl ?? uploadedFile?.url ?? resolveUploadedFileUrl(uploadedFile?.key)
      if (!fileUrl) {
        toast.error("Image upload failed.")
        return
      }
      form.setValue("profileImageUrl", fileUrl, { shouldValidate: true })
      toast.success("Profile image uploaded.")
    },
    onUploadError: (error) => {
      toast.error(error.message)
    },
  })
  const resumeUploader = useUploadThing("talentResumeUploader", {
    onClientUploadComplete: (files) => {
      const uploadedFile = files[0]
      const fileUrl =
        uploadedFile?.ufsUrl ?? uploadedFile?.url ?? resolveUploadedFileUrl(uploadedFile?.key)
      if (!fileUrl) {
        toast.error("Resume upload failed.")
        return
      }
      form.setValue("resumeUrl", fileUrl, { shouldValidate: true })
      form.setValue("resumeFileName", uploadedFile?.name ?? "", { shouldValidate: true })
      toast.success("Resume uploaded.")
    },
    onUploadError: (error) => {
      toast.error(error.message)
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
        className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6"
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
              <Select value={field.value ?? "PENDING"} onValueChange={field.onChange}>
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
        <div className="grid gap-4 md:grid-cols-2">
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
                await imageUploader.startUpload([file])
                event.currentTarget.value = ""
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              disabled={imageUploader.isUploading}
              onClick={() => imageInputRef.current?.click()}
            >
              {imageUploader.isUploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
              {imageUploader.isUploading ? "Uploading image..." : "Choose image"}
            </Button>
            <p className="text-xs text-muted-foreground">
              {uploadedProfileImage ? "Image uploaded." : "JPG or PNG recommended."}
            </p>
            {uploadedProfileImage ? (
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedProfileImage}
                  alt="Uploaded profile preview"
                  className="h-56 w-full rounded-md object-contain"
                />
              </div>
            ) : null}
          </FormItem>
          <FormItem className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
            <FormLabel>Resume (PDF)</FormLabel>
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
                await resumeUploader.startUpload([file])
                event.currentTarget.value = ""
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              disabled={resumeUploader.isUploading}
              onClick={() => resumeInputRef.current?.click()}
            >
              {resumeUploader.isUploading ? <LoaderCircle className="animate-spin" /> : <FileUp />}
              {resumeUploader.isUploading ? "Uploading resume..." : "Choose resume"}
            </Button>
            <p className="text-xs text-muted-foreground">
              {uploadedResumeName ? `Uploaded: ${uploadedResumeName}` : "Attach a PDF resume (optional)."}
            </p>
            {uploadedResumeUrl ? (
              <div className="space-y-2">
                <a
                  href={uploadedResumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline underline-offset-2"
                >
                  Preview uploaded resume
                </a>
                <iframe
                  src={uploadedResumeUrl}
                  title="Uploaded resume preview"
                  className="h-56 w-full rounded-lg border border-border"
                />
              </div>
            ) : null}
          </FormItem>
        </div>
        <Button size="lg" disabled={isPending}>
          {isPending ? <LoaderCircle className="animate-spin" /> : null}
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  )
}
