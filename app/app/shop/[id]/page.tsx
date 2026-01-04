import Link from "next/link";
import { getProductById } from "../../../lib/products";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <p className="text-slate-700">Product not found.</p>
        <Link className="mt-3 inline-block text-sky-700 underline" href="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Link className="text-sky-700 underline" href="/shop">
        ← Back to shop
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>
          <p className="mt-2 text-slate-600">{product.description ?? ""}</p>

          <div className="mt-4 space-y-1 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Length:</span>{" "}
              {product.length ?? "—"}
            </div>
            <div>
              <span className="font-semibold">Texture:</span>{" "}
              {product.texture ?? "—"}
            </div>
            <div>
              <span className="font-semibold">Lace:</span> {product.lace ?? "—"}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-slate-900">${product.price}</div>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="productId" value={product.id} />
              <button className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white">
                Buy (Stripe)
              </button>
            </form>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Checkout uses Stripe. If Stripe env vars aren’t set yet, this button won’t work.
          </p>
        </div>
      </div>
    </div>
  );
}
