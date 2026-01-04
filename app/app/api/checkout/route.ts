import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeKey || !siteUrl) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_SITE_URL env vars." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  const form = await req.formData();
  const productId = String(form.get("productId") || "");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/checkout/success`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `LaceLink Purchase (${productId || "product"})` },
          unit_amount: 19900,
        },
        quantity: 1,
      },
    ],
  });

  return NextResponse.redirect(session.url!, 303);
}
