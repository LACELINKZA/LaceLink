import Link from "next/link"
import { productsSeed } from "../../lib/productsSeed"

export default function ShopPage() {
  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Shop Wigs</h1>
      <p className="mt-1 text-slate-600">
        Browse trending installs from verified sellers.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {productsSeed.map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.id}`}
            className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur hover:border-sky-300"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900">{p.title}</h2>
                <div className="font-bold text-slate-900">${p.price}</div>
              </div>

              <p className="mt-1 text-sm text-slate-600">
                {p.length} • {p.texture} • {p.lace}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
