"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";

export default function ProductPage({ params }: any) {
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!product) return <main className="container"><div className="card">Not found</div></main>;

  async function checkout() {
    try {
      setLoading(true);
      setMsg(null);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{product.name}</h1>
        <p style={{ color: "var(--muted)" }}>{product.description}</p>
        <div className="row">
          <span className="badge">${(product.priceCents / 100).toFixed(2)}</span>
          <span className="badge">{product.rating}★ · {product.reviewCount} reviews</span>
        </div>
        <hr className="hr" />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button className="btnPrimary" onClick={checkout} disabled={loading}>
            {loading ? "Redirecting…" : "Buy now"}
          </button>
          {msg ? <span className="badge" style={{ color: msg.startsWith("Vendor") ? "crimson" : "inherit" }}>{msg}</span> : null}
        </div>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>
          If you see “Vendor payouts not enabled…”, log in as vendor and complete Stripe Connect onboarding first.
        </p>
      </div>
    </main>
  );
}
