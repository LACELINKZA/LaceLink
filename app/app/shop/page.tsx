"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ListingRow = {
  id: string;
  title: string;
  price_cents: number;
  currency: string;
  is_active: boolean;
  listing_images?: { image_url: string; sort_order: number }[];
};

function formatMoney(priceCents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      priceCents / 100
    );
  } catch {
    return `$${(priceCents / 100).toFixed(2)}`;
  }
}

export default function ShopPage() {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setStatus("");

    // Public shop: show only active listings
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, title, price_cents, currency, is_active, listing_images(image_url, sort_order)"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setItems((data as ListingRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Shop</h1>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/vendor/listings" style={{ textDecoration: "none" }}>
            Vendor Dashboard →
          </Link>
        </div>
      </div>

      {status ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.03)",
          }}
        >
          {status}
        </div>
      ) : null}

      {loading ? (
        <div style={{ marginTop: 14, opacity: 0.7 }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ marginTop: 14, opacity: 0.7 }}>
          No listings yet. Vendors can add products in their dashboard.
        </div>
      ) : (
        <section
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((it) => {
            const cover =
              (it.listing_images || [])
                .slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]
                ?.image_url || "";

            return (
              <Link
                key={it.id}
                href={`/shop/${it.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "grid",
                }}
              >
                <div style={{ height: 220, background: "rgba(0,0,0,0.03)" }}>
                  {cover ? (
                    <img
                      src={cover}
                      alt={it.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        opacity: 0.6,
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <div style={{ padding: 12, display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 800 }}>{it.title}</div>
                  <div style={{ opacity: 0.75, fontSize: 13 }}>
                    {formatMoney(it.price_cents, it.currency)}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
