"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(149);
  const [length, setLength] = useState("");
  const [texture, setTexture] = useState("");
  const [lace, setLace] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const id = useMemo(() => {
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return slug ? `${slug}-${length || "wig"}`.toLowerCase() : "";
  }, [title, length]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!price || price < 1) return setError("Price must be at least 1.");
    if (!id) return setError("ID could not be generated. Add a title.");

    try {
      setSaving(true);

      const { error } = await supabase.from("products").upsert({
        id,
        title: title.trim(),
        price: Math.round(price),
        length: length.trim() || null,
        texture: texture.trim() || null,
        lace: lace.trim() || null,
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
      });

      if (error) throw error;

      setMessage("Saved ✅ Go check /shop");
    } catch (err: any) {
      setError(err?.message || "Save failed. Check your Supabase env vars + table.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Add a Product</h1>
      <p className="mt-1 text-slate-600">
        This saves into Supabase table: <code>products</code>.
      </p>

      <form
        onSubmit={onSave}
        className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur"
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Title *</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HD Lace Body Wave Wig"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Price (USD) *
            </label>
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Length</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="24 inch"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Texture</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={texture}
              onChange={(e) => setTexture(e.target.value)}
              placeholder="Body Wave"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Lace</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={lace}
              onChange={(e) => setLace(e.target.value)}
              placeholder="HD Lace"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Image URL (fast demo)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 text-xs text-slate-500">
          Generated Product ID: <code className="font-mono">{id || "—"}</code>
        </div>

        <div className="mt-6">
          <button
            disabled={saving}
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
