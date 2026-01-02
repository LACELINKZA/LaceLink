"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useMe } from "@/lib/useMe";

type PendingReq = {
  id: string;
  status: string;
  notes?: string | null;
  adminNotes?: string | null;
  docImageUrls: string[];
  createdAt: string;
  vendor: {
    id: string;
    storeName: string;
    website?: string | null;
    user: { email?: string | null; name?: string | null };
  };
};

export default function AdminPage() {
  const { isAuthed, role } = useMe();
  const [pending, setPending] = useState<PendingReq[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const res = await fetch("/api/admin/vendors/pending");
    const data = await res.json();
    if (!res.ok) setMsg(`❌ ${data?.error || "Failed to load"}`);
    else setPending(data.pending || []);
  }

  useEffect(() => {
    if (isAuthed && role === "ADMIN") load();
  }, [isAuthed, role]);

  async function decide(vendorId: string, decision: "APPROVED" | "DENIED") {
    const adminNotes = prompt(`Admin notes (${decision})? (optional)`) || "";
    const res = await fetch("/api/admin/vendors/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, decision, adminNotes }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(`❌ ${data?.error || "Decision failed"}`);
    else {
      setMsg(`✅ Vendor ${decision.toLowerCase()}.`);
      load();
    }
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-[#eef6ff]">
        <AppHeader />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 text-slate-700">
            Please <a className="text-sky-700 underline" href="/auth/signin">sign in</a>.
          </div>
        </div>
      </main>
    );
  }

  if (role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#eef6ff]">
        <AppHeader />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 text-slate-700">
            Forbidden.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef6ff]">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-extrabold text-sky-700">Admin Dashboard</h1>
        <p className="mt-2 text-slate-700">Review vendor verification requests.</p>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={load} className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
            Refresh
          </button>
          {msg && (
            <div className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-slate-700">{msg}</div>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          {pending.length === 0 ? (
            <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 text-slate-700">
              No pending requests.
            </div>
          ) : (
            pending.map((r) => (
              <div key={r.id} className="rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xl font-bold text-slate-800">{r.vendor.storeName}</div>
                    <div className="text-slate-700">
                      {r.vendor.user.name || "Vendor"} — {r.vendor.user.email}
                    </div>
                    {r.vendor.website && <div className="text-sm text-slate-600">{r.vendor.website}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => decide(r.vendor.id, "APPROVED")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                      Approve
                    </button>
                    <button onClick={() => decide(r.vendor.id, "DENIED")}
                      className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">
                      Deny
                    </button>
                  </div>
                </div>

                {r.notes && (
                  <div className="mt-3 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">
                    <div className="text-xs font-semibold text-slate-500">Vendor notes</div>
                    {r.notes}
                  </div>
                )}

                {r.docImageUrls?.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">Docs</div>
                    <div className="flex flex-wrap gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {r.docImageUrls.map((u) => (
                        <img key={u} src={u} alt="doc" className="h-20 w-20 rounded-xl object-cover" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-slate-500">
                  Submitted: {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
