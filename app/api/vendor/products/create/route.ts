import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { vendorProfile: true },
  });
  if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN") || !user.vendorProfile) {
    return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
  }

  const { name, description, category, price, fastShipping, imageUrls, affiliateLinks } =
    await req.json();

  if (!name?.trim() || !category?.trim() || !Number.isInteger(price) || price <= 0) {
    return NextResponse.json({ error: "Invalid product fields" }, { status: 400 });
  }

  const created = await prisma.product.create({
    data: {
      vendorId: user.vendorProfile.id,
      name: name.trim(),
      description: description?.trim() || null,
      category: category.trim(),
      price,
      fastShipping: Boolean(fastShipping),
      images: {
        create: (Array.isArray(imageUrls) ? imageUrls : [])
          .filter(Boolean)
          .map((url: string) => ({ url })),
      },
      affiliateLinks: {
        create: (Array.isArray(affiliateLinks) ? affiliateLinks : [])
          .filter((x) => x?.url && x?.label)
          .map((x) => ({ label: x.label, url: x.url, provider: x.provider || null })),
      },
    },
  });

  return NextResponse.json({ ok: true, productId: created.id });
}
