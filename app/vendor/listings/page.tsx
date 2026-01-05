"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Listing = {
  id: string;
  title: string;
  price_cents: number;
  currency: string;
  is_active: boolean;
  created_at: string;
};

function formatMoney(priceCents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(priceCents / 100);
  } catch {
    return `$${(priceCents / 100).toFixed(2)}`;
  }
}

export default function VendorListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    setLoading(true);
    setStatus("");

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      setStatus(userErr.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setStatus("Please sign in to manage your listings.");
      setLoading(false);
      return;
    }

    // Vendor's listings are filtered by vendor_id = auth user id
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price_cents, currency, is_active, created_at")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setListings((data as Listing[]) ?? []);
    setLoading(false);
  }

  async function deleteListing(id: string) {
    const ok = confirm("Delete this listing? This cannot be undone.");
    if (!ok) return;

    setStatus("");

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    setListings((prev) => prev.filter((l) => l.id !== id));
    setStatus("Listing deleted ✅");
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Your Listings</h1>
        <div style={{ marginLeft: "auto" }}>
          <Link
            href="/vendor/listings/new"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            + Create New Listing
          </Link>
        </div>
      </div>

      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Manage your products here. You can create, edit, and delete listings.
      </p>

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

      <section style={{ marginTop: 16 }}>
        {loading ? (
          <div style={{ padding: 14, opacity: 0.7 }}>Loading…</div>
        ) : listings.length === 0 ? (
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <p style={{ marginTop: 0 }}>
              You don’t have any listings yet.
            </p>
            <Link href="/vendor/listings/new">Create your first listing →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {listings.map((l) => (
              <div
                key={l.id}
                style={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{l.title}</div>
                  <div style={{ opacity: 0.75, fontSize: 13, marginTop: 4 }}>
                    {formatMoney(l.price_cents, l.currency)} •{" "}
                    {l.is_active ? "Active" : "Hidden"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/vendor/listings/${l.id}/edit`}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.15)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteListing(l.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ marginTop: 18 }}>
        <Link href="/vendor/profile">← Back to Vendor Profile</Link>
      </div>
    </main>
  );
}
