"use client";

import { signOut } from "next-auth/react";
import { useMe } from "@/lib/useMe";

export default function AppHeader() {
  const { status, isAuthed, role } = useMe();

  return (
    <div className="sticky top-0 z-20 border-b border-sky-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="text-lg font-extrabold text-sky-700">LaceLink</a>

        <div className="flex items-center gap-3 text-sm">
          {status === "loading" ? (
            <span className="text-slate-500">Loading…</span>
          ) : isAuthed ? (
            <>
              {role === "ADMIN" && (
                <a className="font-semibold text-sky-700 underline" href="/admin">Admin</a>
              )}
              {(role === "VENDOR" || role === "ADMIN") && (
                <a className="font-semibold text-sky-700 underline" href="/vendor/dashboard">Vendor Dashboard</a>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-xl border border-sky-200 bg-white px-3 py-2 font-semibold text-sky-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <a className="font-semibold text-sky-700 underline" href="/auth/signin">Sign in</a>
              <a className="font-semibold text-sky-700 underline" href="/auth/signup">Sign up</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
