import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const imageUploadConfig = {
  image: {
    maxFileCount: 1,
    maxFileSize: "4MB",
  },
} as const

const resumeUploadConfig = {
  pdf: {
    maxFileCount: 1,
    maxFileSize: "8MB",
  },
} as const

const handleImageUploadComplete = ({ file }: { file: { ufsUrl: string; name: string } }) => {
  return { url: file.ufsUrl, name: file.name }
}

const handleResumeUploadComplete = ({ file }: { file: { ufsUrl: string; name: string } }) => {
  return { url: file.ufsUrl, name: file.name }
}

export const uploadRouter = {
  // Keep legacy route names for already-loaded clients.
  talentImage: f(imageUploadConfig).onUploadComplete(handleImageUploadComplete),
  talentImageUploader: f(imageUploadConfig).onUploadComplete(handleImageUploadComplete),
  talentResume: f(resumeUploadConfig).onUploadComplete(handleResumeUploadComplete),
  talentResumeUploader: f(resumeUploadConfig).onUploadComplete(handleResumeUploadComplete),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
