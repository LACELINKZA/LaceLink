export default function FeedbackPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Feedback</h1>
      <p className="mt-2 text-slate-600">
        Send this page to testers and ask: “What’s confusing? What feels missing?
        What would make you trust this?”
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <p className="text-slate-700">
          Quick way: paste a Google Form link here, or use email:
        </p>
        <a
          className="mt-3 inline-block text-sky-700 underline"
          href="mailto:hello@lacelink.com?subject=LaceLink%20Feedback"
        >
          Email feedback
        </a>
      </div>
    </div>
  );
}
