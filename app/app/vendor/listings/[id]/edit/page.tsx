"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type PageProps = { params: { id: string } };

type Listing = {
  id: string;
  vendor_id: string;
  title: string;
  description: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
};

type ListingImage = {
  id: string;
  image_url: string;
  sort_order: number;
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

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export default function EditListingPage({ params }: PageProps) {
  const router = useRouter();
  const listingId = params.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const cover = useMemo(() => images?.[0]?.image_url || "", [images]);

  async function load() {
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
      setStatus("Please sign in.");
      setLoading(false);
      return;
    }

    const { data: l, error: lErr } = await supabase
      .from("listings")
      .select("id, vendor_id, title, description, price_cents, currency, is_active")
      .eq("id", listingId)
      .maybeSingle();

    if (lErr) {
      setStatus(lErr.message);
      setLoading(false);
      return;
    }
    if (!l) {
      setStatus("Listing not found.");
      setLoading(false);
      return;
    }

    // Security: ensure vendor owns listing (RLS should handle too, but UX matters)
    if (l.vendor_id !== user.id) {
      setStatus("You don't have access to edit this listing.");
      setLoading(false);
      return;
    }

    const { data: imgs, error: imgErr } = await supabase
      .from("listing_images")
      .select("id, image_url, sort_order")
      .eq("listing_id", listingId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (imgErr) {
      setStatus(imgErr.message);
      setLoading(false);
      return;
    }

    setListing(l as Listing);
    setImages((imgs as ListingImage[]) ?? []);

    setTitle(l.title ?? "");
    setDescription(l.description ?? "");
    setPrice(centsToDollars(l.price_cents ?? 0));
    setCurrency(l.currency ?? "USD");
    setIsActive(!!l.is_active);

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  async function saveChanges() {
    if (!listing) return;

    setSaving(true);
    setStatus("");

    const price_cents = dollarsToCents(price);

    const { error } = await supabase
      .from("listings")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        price_cents,
        currency,
        is_active: isActive,
      })
      .eq("id", listing.id);

    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }

    setStatus("Saved ✅");
    setSaving(false);
  }

  async function uploadImages(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please sign in.");
      setUploading(false);
      return;
    }

    // Upload each file to storage, then insert URL into listing_images
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const safeName = file.name.replace(/\s+/g, "-");
      const path = `${user.id}/${listingId}/${Date.now()}-${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { upsert: false });

      if (upErr) {
        setStatus(upErr.message);
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);

      const publicUrl = publicData.publicUrl;

      const nextSort = images.length + i;

      const { error: insErr } = await supabase.from("listing_images").insert({
        listing_id: listingId,
        image_url: publicUrl,
        sort_order: nextSort,
      });

      if (insErr) {
        setStatus(insErr.message);
        setUploading(false);
        return;
      }
    }

    setStatus("Uploaded ✅");
    setUploading(false);
    await load();
  }

  async function deleteImage(imageId: string) {
    const ok = confirm("Remove this image?");
    if (!ok) return;

    setStatus("");

    const { error } = await supabase
      .from("listing_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      setStatus(error.message);
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setStatus("Image removed ✅");
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, opacity: 0.7 }}>
        Loading…
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ margin: 0 }}>Edit Listing</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Link href="/vendor/listings">← Back</Link>
          <button
            onClick={() => router.push(`/shop/${listingId}`)}
            style={ghostButton}
          >
            View Public Page
          </button>
        </div>
      </div>

      {status ? (
        <div style={statusBox}>{status}</div>
      ) : null}

      <section style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {cover ? (
          <div style={coverBox}>
            {/* Using normal img keeps it simple for Supabase public URLs */}
            <img
              src={cover}
              alt="Cover"
              style={{ width: "100%", height: 320, objectFit: "cover" }}
            />
          </div>
        ) : (
          <div style={{ ...coverBox, display: "grid", placeItems: "center", opacity: 0.6 }}>
            No images yet
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              style={textareaStyle}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              Price
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                style={inputStyle}
              />
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                Preview:{" "}
                {formatMoney(dollarsToCents(price), currency)}
              </div>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Currency
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
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
            onClick={saveChanges}
            disabled={saving}
            style={{
              ...buttonStyle,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ margin: "0 0 10px" }}>Photos</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "grid", gap: 6 }}>
            Upload images
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              onChange={(e) => uploadImages(e.target.files)}
            />
          </label>

          {uploading ? <div style={{ opacity: 0.7 }}>Uploading…</div> : null}
        </div>

        {images.length > 0 ? (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {images.map((img) => (
              <div key={img.id} style={imgCard}>
                <img
                  src={img.image_url}
                  alt="Listing image"
                  style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12 }}
                />
                <button onClick={() => deleteImage(img.id)} style={smallButton}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 12, opacity: 0.7 }}>
            No images yet. Upload at least 1 photo so your listing looks legit.
          </div>
        )}
      </section>
    </main>
  );
}

const statusBox: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(0,0,0,0.03)",
};

const coverBox: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  overflow: "hidden",
};

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

const ghostButton: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 600,
};

const imgCard: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  padding: 10,
  display: "grid",
  gap: 10,
};

const smallButton: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  cursor: "pointer",
  fontWeight: 700,
};
