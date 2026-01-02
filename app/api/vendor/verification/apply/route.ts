import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { vendorProfile: true },
  });
  if (!user?.vendorProfile || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
  }

  const { notes, docImageUrls } = await req.json();
  const urls = Array.isArray(docImageUrls) ? docImageUrls.filter(Boolean) : [];

  const reqRow = await prisma.vendorVerificationRequest.upsert({
    where: { vendorId: user.vendorProfile.id },
    create: {
      vendorId: user.vendorProfile.id,
      status: "PENDING",
      notes: notes?.trim() || null,
      docImageUrls: urls,
    },
    update: {
      status: "PENDING",
      notes: notes?.trim() || null,
      docImageUrls: urls,
    },
  });

  await prisma.vendorProfile.update({
    where: { id: user.vendorProfile.id },
    data: { verificationStatus: "PENDING" },
  });

  return NextResponse.json({ ok: true, requestId: reqRow.id });
}
