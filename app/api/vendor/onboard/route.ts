import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storeName, website, bio } = await req.json();
  if (!storeName?.trim())
    return NextResponse.json({ error: "storeName required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      role: "VENDOR",
      vendorProfile: {
        upsert: {
          create: { storeName, website, bio },
          update: { storeName, website, bio },
        },
      },
    },
  });

  return NextResponse.json({ ok: true });
}
