"use client"

import { useState } from "react"
import { supabase } from "../../../lib/supabaseClient"

export default function VendorDashboard() {
  const [storeName, setStoreName] = useState("")
  const [website, setWebsite] = useState("")
  const [bio, setBio] = useState("")

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!storeName.trim()) {
      setError("Store name is required.")
      return
    }

    try {
      setSaving(true)

      const { error } = await supabase.from("vendor_profiles").insert({
        store_name: storeName.trim(),
        website: website.trim() || null,
        bio: bio.trim() || null,
      })

      if (error) throw error

      setMessage("Saved to database ✅")
      setStoreName("")
      setWebsite("")
      setBio("")
    } catch (err: any) {
      setError(err?.message || "Save failed. Check Supabase env vars + table name.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
      <p className="mt-1 text-slate-600">
        Set up your store profile.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur"
      >
        <h2 className="text-xl font-semibold text-slate-800">
          Vendor Profile
        </h2>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Store Name <span className="text-red-500">*</span>
          </label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            placeholder="e.g. LaceLink Beauty"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Website</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            placeholder="https://yourstore.com"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            placeholder="What do you specialize in?"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

