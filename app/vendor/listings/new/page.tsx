"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NewListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>(""); // dollars input
  const [currency, setCurrency] = useState("USD");
  const [isActive, setIsActive] = useState(true);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function dollarsToCents(v: string) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.round(n * 100);
  }

  async function createListing() {
    setStatus("");
    setSaving(true);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      setStatus(userErr.message);
      setSaving(false);
      return;
    }
    if (!user) {
      setStatus("Please sign in first.");
      setSaving(false);
      return;
    }

    // Optional: ensure vendor profile exists
    const { data: vendor, error: vendorErr } = await supabase
      .from("vendors")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (vendorErr) {
      setStatus(vendorErr.message);
      setSaving(false);
      return;
    }
    if (!vendor) {
      setStatus("Please create your vendor profile first: /vendor/profile");
      setSaving(false);
      return;
    }

    if (!title.trim()) {
      setStatus("Title is required.");
      setSaving(false);
      return;
    }

    const price_cents = dollarsToCents(price);

    const { data, error } = await supabase
      .from("listings")
      .insert({
        vendor_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        price_cents,
        currency,
        is_active: isActive,
      })
      .select("id")
      .single();

    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }

    setStatus("Listing created ✅ Redirecting…");
    setSaving(false);

    router.push(`/vendor/listings/${data.id}/edit`);
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ margin: 0 }}>Create Listing</h1>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/vendor/listings">← Back</Link>
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

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Title *
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., HD Lace Frontal Wig (20”)"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details, hair type, density, cap size, notes, etc."
            rows={6}
            style={textareaStyle}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Price (USD dollars)
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 199.00"
              inputMode="decimal"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={inputStyle}
            >
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (visible in shop)
        </label>

        <button
          onClick={createListing}
          disabled={saving}
          style={{
            ...buttonStyle,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Creating..." : "Create Listing"}
        </button>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
};

const textareaStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  fontWeight: 700,
};
