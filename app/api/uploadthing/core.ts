import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  verificationDocs: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      // No auth yet — allow uploads for now
      return {};
    })
    .onUploadComplete(async () => {
      return { ok: true };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
