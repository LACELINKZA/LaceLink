import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  return NextResponse.redirect(new URL(`/product/${id}`, request.url));
}