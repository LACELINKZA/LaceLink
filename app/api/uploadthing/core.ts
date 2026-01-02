import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const fileRouter = {
  productImages: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user?.email) throw new Error("Unauthorized");
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) throw new Error("Not vendor");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  reviewPhotos: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user?.email) throw new Error("Unauthorized");
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  verificationDocs: f({ image: { maxFileSize: "6MB", maxFileCount: 6 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user?.email) throw new Error("Unauthorized");
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) throw new Error("Not vendor");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
