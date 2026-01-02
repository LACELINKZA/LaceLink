import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const link = await prisma.affiliateLink.findUnique({ where: { id: params.id } });
  if (!link) redirect("/");

  const session = await getServerSession();
  const userId = (session?.user as any)?.id as string | undefined;

  await prisma.affiliateClick.create({
    data: {
      affiliateLinkId: link.id,
      userId: userId || null,
      ipHash: null,
      userAgent: null,
    },
  });

  redirect(link.url);
}
