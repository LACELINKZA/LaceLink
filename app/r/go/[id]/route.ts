import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  return NextResponse.redirect(new URL(`/product/${id}`, request.url));
}
