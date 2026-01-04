export default function StartPage() {
  const card =
    "rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur hover:border-sky-300";
  const btn =
    "inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white";
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">LaceLink — Demo Hub</h1>
      <p className="mt-2 text-slate-600">
        Use these links to test the marketplace flow.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a className={card} href="/shop">
          <div className="text-lg font-semibold text-slate-900">Shop Wigs</div>
          <p className="mt-1 text-sm text-slate-600">
            Browse products + open a product page.
          </p>
          <div className="mt-4">
            <span className={btn}>Open Shop</span>
          </div>
        </a>

        <a className={card} href="/vendor/products/new">
          <div className="text-lg font-semibold text-slate-900">
            Add a Product
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Vendor flow: create a product in Supabase.
          </p>
          <div className="mt-4">
            <span className={btn}>Add Product</span>
          </div>
        </a>

        <a className={card} href="/how-it-works">
          <div className="text-lg font-semibold text-slate-900">
            How It Works
          </div>
          <p className="mt-1 text-sm text-slate-600">Simple explainer page.</p>
          <div className="mt-4">
            <span className={btn}>View</span>
          </div>
        </a>

        <a className={card} href="/feedback">
          <div className="text-lg font-semibold text-slate-900">Feedback</div>
          <p className="mt-1 text-sm text-slate-600">
            Share this with testers so you get notes.
          </p>
          <div className="mt-4">
            <span className={btn}>Open</span>
          </div>
        </a>

        <a className={card} href="/login">
          <div className="text-lg font-semibold text-slate-900">Login</div>
          <p className="mt-1 text-sm text-slate-600">
            Basic Supabase email/password auth.
          </p>
          <div className="mt-4">
            <span className={btn}>Login</span>
          </div>
        </a>
      </div>
    </div>
  );
}
