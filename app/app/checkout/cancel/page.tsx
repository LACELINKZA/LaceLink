export default function CancelPage() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Checkout canceled</h1>
      <p className="mt-2 text-slate-600">No worries — you can try again anytime.</p>
      <a className="mt-6 inline-block text-sky-700 underline" href="/shop">
        Back to shop
      </a>
    </div>
  );
}
