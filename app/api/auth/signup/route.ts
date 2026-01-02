import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password, name, username } = await req.json();

  const cleanEmail = String(email || "").toLowerCase().trim();
  if (!cleanEmail || !password || String(password).length < 8) {
    return NextResponse.json(
      { error: "Email and password (8+ chars) required." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: cleanEmail,
      name: name?.trim() || null,
      username: username?.trim() || null,
      passwordHash,
      role:
        process.env.ADMIN_EMAIL?.toLowerCase() === cleanEmail ? "ADMIN" : "USER",
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
