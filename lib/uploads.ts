const UPLOADTHING_FILE_BASE = "https://utfs.io/f/"

export function resolveUploadedFileUrl(key: string | null | undefined) {
  if (!key) {
    return null
  }

  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key
  }

  return `${UPLOADTHING_FILE_BASE}${key}`
}
