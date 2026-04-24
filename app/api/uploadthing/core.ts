import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const uploadRouter = {
  talentImageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl, name: file.name }
  }),
  talentResumeUploader: f({
    pdf: {
      maxFileCount: 1,
      maxFileSize: "8MB",
    },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl, name: file.name }
  }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
