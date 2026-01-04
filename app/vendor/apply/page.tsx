export default function VendorApplyPage() {
  // Put your Google Form or Typeform embed URL below
  const embedUrl =
    "PASTE_YOUR_EMBED_URL_HERE";

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Apply to Become a Vendor</h1>
      <p style={{ opacity: 0.8 }}>
        Fill out the form below and we’ll review your application.
      </p>

      <div
        style={{
          marginTop: 16,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height="900"
          style={{ border: 0 }}
          allow="camera; microphone; autoplay; encrypted-media;"
        />
      </div>
    </main>
  );
}
