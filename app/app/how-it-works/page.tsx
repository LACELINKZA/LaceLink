export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">How LaceLink Works</h1>

      <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1) Browse</h2>
          <p className="text-slate-600">
            Shop wigs by length, texture, and lace type.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">2) Trust</h2>
          <p className="text-slate-600">
            Vendors can verify their business for a “Verified” badge.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">3) Buy</h2>
          <p className="text-slate-600">
            Checkout is powered by Stripe (demo mode).
          </p>
        </div>
      </div>
    </div>
  );
}
