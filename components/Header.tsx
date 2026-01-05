"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "guest";

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "#fff" }}>
      <div className="container row" style={{ justifyContent: "space-between" }}>
        <div className="row" style={{ gap: 14 }}>
          <Link href="/" style={{ fontWeight: 800 }}>LaceLink</Link>
          <Link href="/shop" className="badge">Shop</Link>
          <Link href="/vendor" className="badge">Vendor</Link>
          <Link href="/admin" className="badge">Admin</Link>
        </div>
        <div className="row" style={{ gap: 10 }}>
          {!session ? (
            <Link href="/login" className="btn">Log in</Link>
          ) : (
            <>
              <span className="badge">{session.user?.email} · {role}</span>
              <button className="btn" onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
