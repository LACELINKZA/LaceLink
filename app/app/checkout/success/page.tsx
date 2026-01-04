export default function SuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Payment successful ✅</h1>
      <p className="mt-2 text-slate-600">
        This is a demo confirmation page. Next step is creating an order record.
      </p>
      <a className="mt-6 inline-block text-sky-700 underline" href="/shop">
        Back to shop
      </a>
    </div>
  );
}
