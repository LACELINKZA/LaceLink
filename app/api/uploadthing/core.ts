import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  verificationDocs: f({
    image: { maxFileSize: "8MB", maxFileCount: 6 },
  })
    .middleware(async () => {
    
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
    
      return { ok: true, uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type UploadRouter = typeof ourFileRouter
export type AppFileRouter = typeof ourFileRouter

export const uploadRouter = ourFileRouter
