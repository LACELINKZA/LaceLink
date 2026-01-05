import { prisma } from "@/lib/prisma";

export default async function Admin() {
  const vendors = await prisma.vendor.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Admin</h1>
        <p style={{ color: "var(--muted)" }}>Shows vendors stored in the DB and their Stripe Connect account IDs.</p>

        <div style={{ marginTop: 12 }}>
          {vendors.length === 0 ? (
            <p>No vendors yet. Log in as vendor to create one.</p>
          ) : (
            <div className="grid">
              {vendors.map(v => (
                <div key={v.id} className="card" style={{ background: "#fff" }}>
                  <div style={{ fontWeight: 700 }}>{v.displayName ?? "Vendor"}</div>
                  <div style={{ color: "var(--muted)" }}>{v.email}</div>
                  <div className="badge" style={{ marginTop: 8 }}>acct: {v.stripeAccountId ?? "none"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
