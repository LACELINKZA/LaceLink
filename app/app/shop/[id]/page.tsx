import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ✅ Vercel/Next types in your logs expect params to behave like a Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price_cents: number;
  currency?: string | null;
  image_url?: string | null;
  in_stock?: boolean | null;
  category?: string | null;
};

// ---------- helpers ----------
function formatMoney(priceCents: number, currency: string = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(priceCents / 100);
  } catch {
    return `$${(priceCents / 100).toFixed(2)}`;
  }
}

function safeStr(v: unknown) {
  return typeof v === "string" ? v : "";
}

// ✅ demo fallback data so build never fails if DB isn't ready
const DEMO_PRODUCTS: Product[] = [
  {
    id: "lace-closure-18",
    name: "Lace Closure Wig (18\")",
    description:
      "Soft, beginner-friendly lace closure unit. Natural hairline look with easy install.",
    price_cents: 18900,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    in_stock: true,
    category: "Wigs",
  },
  {
    id: "hd-lace-frontal-20",
    name: "HD Lace Frontal Wig (20\")",
    description:
      "HD lace frontal for a melt-down finish. Great for glueless installs and styling.",
    price_cents: 24900,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1520975958221-b96f4f5481a3?auto=format&fit=crop&w=1200&q=80",
    in_stock: true,
    category: "Wigs",
  },
];

// ---------- data fetching ----------
// This tries Supabase if env vars exist; otherwise it uses demo data.
// IMPORTANT: This file runs on the server (safe for secrets).
async function getProductById(id: string): Promise<Product | null> {
  // If you have Supabase set up, these env vars should exist:
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If not configured yet, fall back to demo data:
  if (!supabaseUrl || !serviceRoleKey) {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  // Lazy import so builds don't fail if you haven't installed it yet
  // (but if you DO use DB, you should install: npm i @supabase/supabase-js)
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ✅ Expected table name: "products"
  // Columns expected: id, name, description, price_cents, currency, image_url, in_stock, category
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price_cents, currency, image_url, in_stock, category"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // If your DB isn't ready yet, don't crash builds — just fallback.
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  return (data as Product) ?? null;
}

async function getRelatedProducts(currentId: string): Promise<Product[]> {
  // simple related list: demo items other than current
  return DEMO_PRODUCTS.filter((p) => p.id !== currentId).slice(0, 4);
}

// ---------- UI ----------
export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) notFound();

  const currency = product.currency ?? "USD";
  const price = formatMoney(product.price_cents, currency);
  const inStock = product.in_stock ?? true;
  const related = await getRelatedProducts(product.id);

  return (
    <main style={styles.page}>
      <div style={styles.topNav}>
        <Link href="/shop" style={styles.backLink}>
          ← Back to Shop
        </Link>
      </div>

      <section style={styles.grid}>
        <div style={styles.imageCard}>
          {product.image_url ? (
            <div style={styles.imageWrap}>
              <Image
                src={product.image_url}
                alt={safeStr(product.name) || "Product image"}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : (
            <div style={styles.imagePlaceholder}>No image</div>
          )}
        </div>

        <div style={styles.info}>
          {product.category ? (
            <div style={styles.badge}>{product.category}</div>
          ) : null}

          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.priceRow}>
            <div style={styles.price}>{price}</div>
            <div style={{ ...styles.stock, opacity: inStock ? 1 : 0.65 }}>
              {inStock ? "In stock" : "Out of stock"}
            </div>
          </div>

          {product.description ? (
            <p style={styles.desc}>{product.description}</p>
          ) : (
            <p style={styles.descMuted}>
              No description yet. (You can add one in your products table.)
            </p>
          )}

          <div style={styles.actions}>
            {/* Quantity selector (clientless, basic) */}
            <form action="/api/cart/add" method="POST" style={styles.form}>
              <input type="hidden" name="product_id" value={product.id} />
              <label style={styles.label}>
                Quantity
                <input
                  name="qty"
                  type="number"
                  min={1}
                  defaultValue={1}
                  style={styles.qty}
                />
              </label>

              <button
                type="submit"
                disabled={!inStock}
                style={{
                  ...styles.buttonPrimary,
                  opacity: inStock ? 1 : 0.6,
                  cursor: inStock ? "pointer" : "not-allowed",
                }}
              >
                Add to Cart
              </button>
            </form>

            {/* Buy Now (calls your checkout route if you have it) */}
            <form action="/api/checkout" method="POST" style={styles.form}>
              <input type="hidden" name="product_id" value={product.id} />
              <input type="hidden" name="qty" value="1" />
              <button
                type="submit"
                disabled={!inStock}
                style={{
                  ...styles.buttonSecondary,
                  opacity: inStock ? 1 : 0.6,
                  cursor: inStock ? "pointer" : "not-allowed",
                }}
              >
                Buy Now
              </button>
            </form>
          </div>

          <div style={styles.meta}>
            <div>
              <strong>Product ID:</strong> {product.id}
            </div>
            <div>
              <strong>Currency:</strong> {currency}
            </div>
          </div>

          <div style={styles.note}>
            Tip: this page won’t break builds even if Supabase isn’t set up yet.
            When your DB is ready, just ensure you have:
            <ul style={styles.ul}>
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
              <li>Table: products</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={styles.relatedSection}>
        <h2 style={styles.relatedTitle}>You may also like</h2>
        <div style={styles.relatedGrid}>
          {related.map((p) => (
            <Link key={p.id} href={`/shop/${p.id}`} style={styles.relatedCard}>
              <div style={styles.relatedName}>{p.name}</div>
              <div style={styles.relatedPrice}>
                {formatMoney(p.price_cents, p.currency ?? "USD")}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

// ---------- inline styles (no extra dependencies) ----------
const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "24px 16px 48px",
  },
  topNav: { marginBottom: 16 },
  backLink: {
    textDecoration: "none",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 18,
  },
  imageCard: {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    overflow: "hidden",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
  },
  imagePlaceholder: {
    display: "grid",
    placeItems: "center",
    height: 420,
    opacity: 0.6,
  },
  info: {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 16,
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: 12,
    marginBottom: 10,
  },
  title: { fontSize: 28, lineHeight: 1.15, margin: "6px 0 12px" },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  price: { fontSize: 22, fontWeight: 700 },
  stock: { fontSize: 13 },
  desc: { opacity: 0.9, marginBottom: 18, lineHeight: 1.55 },
  descMuted: { opacity: 0.6, marginBottom: 18, lineHeight: 1.55 },
  actions: { display: "grid", gap: 10, marginBottom: 16 },
  form: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  label: { display: "flex", gap: 8, alignItems: "center", fontSize: 14 },
  qty: {
    width: 80,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
  },
  buttonPrimary: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    fontWeight: 600,
  },
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    fontWeight: 600,
  },
  meta: { fontSize: 13, opacity: 0.75, display: "grid", gap: 6 },
  note: {
    marginTop: 16,
    fontSize: 13,
    opacity: 0.8,
    borderTop: "1px solid rgba(0,0,0,0.08)",
    paddingTop: 12,
  },
  ul: { marginTop: 8, marginBottom: 0 },
  relatedSection: { marginTop: 28 },
  relatedTitle: { fontSize: 18, marginBottom: 10 },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  relatedCard: {
    textDecoration: "none",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 14,
    display: "grid",
    gap: 6,
  },
  relatedName: { fontWeight: 600 },
  relatedPrice: { opacity: 0.75, fontSize: 13 },
};

// Make the grid 2-column on wider screens (simple responsive)
styles.grid = {
  ...styles.grid,
  gridTemplateColumns: "1fr",
} as React.CSSProperties;
