import type { AppFileRouter } from "@/app/api/uploadthing/core"
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react"

export const UploadButton = generateUploadButton<AppFileRouter>()
export const UploadDropzone = generateUploadDropzone<AppFileRouter>()
