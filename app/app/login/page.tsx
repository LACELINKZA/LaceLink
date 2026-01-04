"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setMsg("Account created ✅ You can now log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setMsg("Logged in ✅");
      }
    } catch (e: any) {
      setErr(e?.message || "Auth failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "login" ? "Login" : "Create account"}
      </h1>
      <p className="mt-1 text-slate-600">
        Basic email/password using Supabase Auth.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur"
      >
        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}
        {msg && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {msg}
          </div>
        )}

        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Working..."
            : mode === "login"
            ? "Login"
            : "Create account"}
        </button>

        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
