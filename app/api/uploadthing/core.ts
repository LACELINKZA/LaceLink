import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const uploadRouter = {
  verificationDocs: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        throw new Error("Unauthorized");
      }

      return { userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata }) => {
      return {
        uploadedBy: metadata.userEmail,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
