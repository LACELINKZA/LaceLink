import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pending = await prisma.vendorVerificationRequest.findMany({
    where: { status: "PENDING" },
    include: { vendor: { include: { user: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ pending });
}
