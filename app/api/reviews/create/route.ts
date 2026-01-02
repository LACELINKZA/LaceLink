import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, comment, photoUrls } = await req.json();
  const r = Number(rating);

  if (!productId || !Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating: r,
      comment: comment?.trim() || null,
      photos: {
        create: (Array.isArray(photoUrls) ? photoUrls : [])
          .filter(Boolean)
          .map((url: string) => ({ url })),
      },
    },
  });

  return NextResponse.json({ ok: true, reviewId: review.id });
}
