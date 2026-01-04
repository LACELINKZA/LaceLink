"use client"

import { useState } from "react"

export default function VendorDashboard() {
  // Form fields
  const [storeName, setStoreName] = useState("")
  const [website, setWebsite] = useState("")
  const [bio, setBio] = useState("")

  // UI state
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

      // For now we’ll just “pretend” to save.
      // (Later we can connect this to a real API route / database.)
      await new Promise((r) => setTimeout(r, 700))

      setMessage("Saved! Your vendor profile has been updated.")
    } catch (err) {
      setError("Something went wrong while saving. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
      <p className="mt-1 text-slate-600">
        Set up your store profile so customers can trust your listings.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur"
      >
        <h2 className="text-xl font-semibold text-slate-800">
          Vendor Verification
        </h2>
        <p className="mt-1 text-slate-600">
          Upload docs and submit for review (we’ll add uploads next).
        </p>

        {/* Alerts */}
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

        {/* Store Name */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Store Name <span className="text-red-500">*</span>
          </label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. LaceLink Beauty"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
          />
        </div>

        {/* Website */}
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Website (optional)
          </label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourstore.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
          />
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Store Bio (optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers what you specialize in..."
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
          />
          <p className="mt-2 text-xs text-slate-500">
            Tip: Mention shipping time, hair type options, and your return policy.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStoreName("")
              setWebsite("")
              setBio("")
              setMessage(null)
              setError(null)
            }}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}
