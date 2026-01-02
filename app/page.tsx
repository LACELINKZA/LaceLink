"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";

type Category = "Lace Front" | "HD Lace" | "Bobs" | "Glueless" | "Custom Units";

type Product = {
  id: string;
  name: string;
  vendorName: string;
  price: number;
  imageUrl?: string;
  category: Category;
  fastShipping: boolean;
  verifiedVendor: boolean;
  ratingAvg: number;
  reviewCount: number;
};

const CATEGORIES: Category[] = ["Lace Front", "HD Lace", "Bobs", "Glueless", "Custom Units"];

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    name: "Kira HD Lace 24” Body Wave",
    vendorName: "SilkStrands",
    price: 289,
    category: "HD Lace",
    fastShipping: true,
    verifiedVendor: true,
    ratingAvg: 4.7,
    reviewCount: 183,
    imageUrl: "https://images.unsplash.com/photo-1520975958225-25c7c78f1f2f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-2",
    name: "No-Glue Glueless 18” Straight",
    vendorName: "LaceLux",
    price: 199,
    category: "Glueless",
    fastShipping: false,
    verifiedVendor: true,
    ratingAvg: 4.5,
    reviewCount: 72,
    imageUrl: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1200&q=80",
  },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [onlyFastShipping, setOnlyFastShipping] = useState(false);
  const [onlyVerifiedVendors, setOnlyVerifiedVendors] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    return DEMO_PRODUCTS.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (onlyFastShipping && !p.fastShipping) return false;
      if (onlyVerifiedVendors && !p.verifiedVendor) return false;
      if (min !== null && !Number.isNaN(min) && p.price < min) return false;
      if (max !== null && !Number.isNaN(max) && p.price > max) return false;
      if (!q) return true;
      const haystack = `${p.name} ${p.vendorName} ${p.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeCategory, onlyFastShipping, onlyVerifiedVendors, minPrice, maxPrice]);

  return (
    <main className="min-h-screen bg-[#eef6ff]">
      <AppHeader />

      <div className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-b from-[#d9ecff] to-[#eef6ff]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-5xl font-extrabold tracking-tight text-sky-700 drop-shadow-sm">LaceLink</h1>
            <p className="text-sky-700/70">Search wigs, styles, and verified vendors</p>

            <div className="mt-4 w-full max-w-3xl rounded-2xl border border-sky-200 bg-white/70 p-3 shadow-sm backdrop-blur">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search wigs, styles, vendors..."
                  className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-sky-200"
                />
                <button className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-sky-600">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-5 flex w-full max-w-3xl flex-wrap justify-center gap-3">
              <Chip active={activeCategory === "All"} onClick={() => setActiveCategory("All")} label="All" />
              {CATEGORIES.map((c) => (
                <Chip key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)} label={c} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-3 rounded-2xl border border-sky-200 bg-white/70 p-4 shadow-sm backdrop-blur md:grid-cols-4">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={onlyFastShipping} onChange={(e) => setOnlyFastShipping(e.target.checked)} className="h-4 w-4" />
            Fast shipping (≤ 3 days)
          </label>

          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={onlyVerifiedVendors} onChange={(e) => setOnlyVerifiedVendors(e.target.checked)} className="h-4 w-4" />
            Verified vendors only
          </label>

          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} inputMode="numeric" placeholder="Min price"
            className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-sky-200" />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="Max price"
            className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-sky-200" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-sky-200 bg-white/70 shadow-sm backdrop-blur">
              <div className="relative h-44 w-full bg-sky-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl!} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {p.verifiedVendor && <Badge label="Verified Vendor" />}
                  {p.fastShipping && <Badge label="Fast Shipping" />}
                </div>
              </div>

              <div className="p-4">
                <div className="text-lg font-bold text-slate-800">{p.name}</div>
                <div className="mt-1 text-sm text-slate-600">{p.vendorName}</div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-extrabold text-sky-700">{formatPrice(p.price)}</div>
                  <div className="text-sm text-slate-600">⭐ {p.ratingAvg.toFixed(1)} ({p.reviewCount})</div>
                </div>

                <a href="/vendor/dashboard" className="mt-4 block w-full rounded-xl bg-sky-500 px-4 py-3 text-center font-semibold text-white hover:bg-sky-600">
                  View Listing
                </a>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-sky-200 bg-white/70 p-10 text-center text-slate-700">
              No results. Try a different search or remove filters.
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-sky-200 bg-white/70 p-6 text-center text-slate-700">
          Vendor? Upload your units and get verified.{" "}
          <a className="font-semibold text-sky-700 underline" href="/vendor/dashboard">Go to Vendor Portal</a>
        </div>
      </div>
    </main>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition",
        active ? "border-sky-400 bg-sky-500 text-white" : "border-sky-200 bg-white/70 text-sky-700 hover:bg-white",
      ].join(" ")}>
      {label}
    </button>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700">
      {label}
    </span>
  );
}
