import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return NextResponse.redirect(
    new URL(`/product/${id}`, request.url)
  );
}
