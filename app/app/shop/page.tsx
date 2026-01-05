"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";

type Sort = "price-asc" | "price-desc" | "reviews" | "rating";

export default function Shop() {
  const [sort, setSort] = useState<Sort>("price-asc");
  const [minRating45, setMinRating45] = useState(false);
  const [laceType, setLaceType] = useState("");
  const [curlPattern, setCurlPattern] = useState("");
  const [hairType, setHairType] = useState("");
  const [color, setColor] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (minRating45 && p.rating < 4.5) return false;
      if (laceType && p.laceType !== laceType) return false;
      if (curlPattern && p.curlPattern !== curlPattern) return false;
      if (hairType && p.hairType !== hairType) return false;
      if (color && p.color !== color) return false;
      return true;
    });
  }, [minRating45, laceType, curlPattern, hairType, color]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sort === "price-asc") return a.priceCents - b.priceCents;
      if (sort === "price-desc") return b.priceCents - a.priceCents;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  return (
    <main className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Shop</h1>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="price-asc">Sort by: Price Low → High</option>
          <option value="price-desc">Sort by: Price High → Low</option>
          <option value="reviews">Sort by: Review count</option>
          <option value="rating">Sort by: Rating</option>
        </select>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row">
          <label className="badge">
            <input type="checkbox" checked={minRating45} onChange={(e) => setMinRating45(e.target.checked)} />
            4.5★ & up
          </label>

          <select className="select" value={laceType} onChange={(e) => setLaceType(e.target.value)}>
            <option value="">Lace type (all)</option>
            <option value="13x4 frontal">13x4 frontal</option>
            <option value="13x6 frontal">13x6 frontal</option>
            <option value="4x4 closure">4x4 closure</option>
            <option value="5x5 closure">5x5 closure</option>
            <option value="2x6 closure">2x6 closure</option>
          </select>

          <select className="select" value={curlPattern} onChange={(e) => setCurlPattern(e.target.value)}>
            <option value="">Curl pattern (all)</option>
            <option value="straight">straight</option>
            <option value="body wave">body wave</option>
            <option value="loose wave">loose wave</option>
            <option value="deep wave">deep wave</option>
            <option value="curly">curly</option>
            <option value="kinky curly">kinky curly</option>
          </select>

          <select className="select" value={hairType} onChange={(e) => setHairType(e.target.value)}>
            <option value="">Hair type (all)</option>
            <option value="synthetic">synthetic</option>
            <option value="human blend">human blend</option>
            <option value="100% human">100% human</option>
          </select>

          <select className="select" value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="">Color (all)</option>
            <option value="black">black</option>
            <option value="brown">brown</option>
            <option value="blonde">blonde</option>
            <option value="colored">colored</option>
          </select>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        {sorted.map((p) => (
          <a key={p.id} className="card" href={`/shop/${p.slug}`}>
            <h3 style={{ margin: "6px 0" }}>{p.name}</h3>
            <div className="row" style={{ gap: 8 }}>
              <span className="badge">${(p.priceCents / 100).toFixed(2)}</span>
              <span className="badge">{p.rating}★</span>
              <span className="badge">{p.reviewCount} reviews</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              {p.laceType} · {p.curlPattern} · {p.hairType} · {p.color}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
