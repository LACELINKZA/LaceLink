import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { vendorId, decision, adminNotes } = await req.json();
  if (!vendorId || !["APPROVED", "DENIED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.vendorVerificationRequest.update({
    where: { vendorId },
    data: { status: decision, adminNotes: adminNotes?.trim() || null },
  });

  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { verificationStatus: decision },
  });

  return NextResponse.json({ ok: true });
}
