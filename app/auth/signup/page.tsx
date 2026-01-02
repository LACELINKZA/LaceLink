"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(`❌ ${data?.error || "Signup failed"}`);
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (login?.ok) router.push("/");
    else router.push("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-[#eef6ff]">
      <div className="mx-auto max-w-md px-4 py-12">
        <a href="/" className="text-sky-700 underline">← Back</a>

        <h1 className="mt-4 text-4xl font-extrabold text-sky-700">Create account</h1>
        <p className="mt-2 text-slate-700">Email + password (8+ chars).</p>

        <div className="mt-6 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (optional)"
            className="mt-3 w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-3 w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+ chars)"
            type="password"
            className="mt-3 w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
          />

          <button
            onClick={submit}
            className="mt-4 w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-600"
          >
            Create account
          </button>

          {msg && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">
              {msg}
            </div>
          )}

          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <a className="font-semibold text-sky-700 underline" href="/auth/signin">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
