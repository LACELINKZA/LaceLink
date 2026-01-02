"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useMe } from "@/lib/useMe";
import { UploadDropzone } from "@/lib/uploadthing";

type AffiliateLinkInput = { label: string; url: string; provider?: string };

export default function VendorDashboardPage() {
  const { isAuthed, role } = useMe();

  const [storeName, setStoreName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [onboardMsg, setOnboardMsg] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Lace Front");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [fastShipping, setFastShipping] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLinkInput[]>([
    { label: "Amazon", url: "", provider: "Amazon" },
  ]);
  const [productMsg, setProductMsg] = useState("");

  const [verificationDocUrls, setVerificationDocUrls] = useState<string[]>([]);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");

  const canUseVendor = isAuthed && (role === "VENDOR" || role === "ADMIN");

  const validAffiliateLinks = useMemo(
    () => affiliateLinks.filter((l) => l.label.trim() && l.url.trim()),
    [affiliateLinks]
  );

  async function onboard() {
    setOnboardMsg("");
    const res = await fetch("/api/vendor/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName, website, bio }),
    });
    const data = await res.json();
    if (!res.ok) setOnboardMsg(`❌ ${data?.error || "Onboarding failed"}`);
    else setOnboardMsg("✅ Vendor profile saved. You can upload products now.");
  }

  async function createProduct() {
    setProductMsg("");
    const priceInt = Number(price);
    const res = await fetch("/api/vendor/products/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        category,
        price: Number.isInteger(priceInt) ? priceInt : Math.round(priceInt),
        fastShipping,
        imageUrls,
        affiliateLinks: validAffiliateLinks,
      }),
    });
    const data = await res.json();
    if (!res.ok) setProductMsg(`❌ ${data?.error || "Create product failed"}`);
    else {
      setProductMsg("✅ Product created!");
      setName("");
      setDescription("");
      setPrice("");
      setFastShipping(false);
      setImageUrls([]);
      setAffiliateLinks([{ label: "Amazon", url: "", provider: "Amazon" }]);
    }
  }

  async function applyVerification() {
    setVerifyMsg("");
    const res = await fetch("/api/vendor/verification/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: verificationNotes,
        docImageUrls: verificationDocUrls,
      }),
    });
    const data = await res.json();
    if (!res.ok) setVerifyMsg(`❌ ${data?.error || "Apply failed"}`);
    else setVerifyMsg("✅ Verification request submitted (PENDING).");
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-[#eef6ff]">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 text-slate-700">
            Please <a className="text-sky-700 underline" href="/auth/signin">sign in</a>.
          </div>
        </div>
      </main>
    );
  }

  if (!canUseVendor) {
    return (
      <main className="min-h-screen bg-[#eef6ff]">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 text-slate-700">
            You’re signed in, but not a vendor yet. Fill out Vendor Profile below to become a vendor.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef6ff]">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-extrabold text-sky-700">Vendor Dashboard</h1>
        <p className="mt-2 text-slate-700">Onboard, upload products, and apply for verification.</p>

        <section className="mt-8 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-bold text-slate-800">Vendor Profile</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Store name"
              className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website (optional)"
              className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio (optional)"
              className="min-h-[90px] rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 md:col-span-2" />
          </div>

          <button onClick={onboard}
            className="mt-4 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
            Save vendor profile
          </button>

          {onboardMsg && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">{onboardMsg}</div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-bold text-slate-800">Create a Product</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Wig name"
              className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200">
              {["Lace Front", "HD Lace", "Bobs", "Glueless", "Custom Units"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="Price (USD)"
              className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />

            <label className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-3 text-slate-700">
              <input type="checkbox" checked={fastShipping} onChange={(e) => setFastShipping(e.target.checked)} className="h-4 w-4" />
              Fast shipping (≤ 3 days)
            </label>

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)"
              className="min-h-[90px] rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 md:col-span-2" />
          </div>

          <div className="mt-5">
            <div className="mb-2 font-semibold text-slate-800">Upload product images</div>
            <UploadDropzone
              endpoint="productImages"
              onClientUploadComplete={(res) => {
                const urls = res?.map((f) => f.url) || [];
                setImageUrls((prev) => [...prev, ...urls]);
              }}
              onUploadError={(error: Error) => setProductMsg(`❌ Upload error: ${error.message}`)}
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 font-semibold text-slate-800">Affiliate links (optional)</div>

            <div className="grid gap-3">
              {affiliateLinks.map((l, idx) => (
                <div key={idx} className="grid gap-3 md:grid-cols-3">
                  <input value={l.label} onChange={(e) => {
                    const v = e.target.value;
                    setAffiliateLinks((prev) => prev.map((x, i) => (i === idx ? { ...x, label: v } : x)));
                  }} placeholder="Label (Amazon / Vendor site)"
                    className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
                  <input value={l.provider || ""} onChange={(e) => {
                    const v = e.target.value;
                    setAffiliateLinks((prev) => prev.map((x, i) => (i === idx ? { ...x, provider: v } : x)));
                  }} placeholder="Provider (optional)"
                    className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
                  <input value={l.url} onChange={(e) => {
                    const v = e.target.value;
                    setAffiliateLinks((prev) => prev.map((x, i) => (i === idx ? { ...x, url: v } : x)));
                  }} placeholder="https://..."
                    className="rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={() => setAffiliateLinks((p) => [...p, { label: "", url: "" }])}
                className="rounded-xl border border-sky-200 bg-white px-4 py-2 font-semibold text-sky-700">
                + Add link
              </button>
              <button onClick={() => setAffiliateLinks((p) => p.slice(0, Math.max(1, p.length - 1)))}
                className="rounded-xl border border-sky-200 bg-white px-4 py-2 font-semibold text-sky-700">
                Remove last
              </button>
            </div>
          </div>

          <button onClick={createProduct}
            className="mt-6 w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-600">
            Create product
          </button>

          {productMsg && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">{productMsg}</div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-bold text-slate-800">Vendor Verification</h2>
          <p className="mt-2 text-slate-700">Upload docs and submit for review.</p>

          <div className="mt-4">
            <div className="mb-2 font-semibold text-slate-800">Upload verification docs</div>
            <UploadDropzone
              endpoint="verificationDocs"
              onClientUploadComplete={(res) => {
                const urls = res?.map((f) => f.url) || [];
                setVerificationDocUrls((prev) => [...prev, ...urls]);
              }}
              onUploadError={(error: Error) => setVerifyMsg(`❌ Upload error: ${error.message}`)}
            />
          </div>

          <textarea value={verificationNotes} onChange={(e) => setVerificationNotes(e.target.value)} placeholder="Notes for admin (optional)"
            className="mt-4 min-h-[90px] w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200" />

          <button onClick={applyVerification}
            className="mt-4 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
            Submit verification request
          </button>

          {verifyMsg && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">{verifyMsg}</div>
          )}
        </section>
      </div>
    </main>
  );
}
