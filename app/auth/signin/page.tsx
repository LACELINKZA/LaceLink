"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [msg, setMsg] = useState("");

  async function signInWithPassword() {
    setMsg("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) router.push("/");
    else setMsg("Invalid email/password.");
  }

  async function sendMagicLink() {
    setMsg("");
    const res = await signIn("email", { email, redirect: false });
    if (res?.ok) setMsg("✅ Check your email for a sign-in link.");
    else setMsg("❌ Could not send link. Check EMAIL_SERVER settings.");
  }

  return (
    <main className="min-h-screen bg-[#eef6ff]">
      <div className="mx-auto max-w-md px-4 py-12">
        <a href="/" className="text-sky-700 underline">← Back</a>

        <h1 className="mt-4 text-4xl font-extrabold text-sky-700">Sign in</h1>
        <p className="mt-2 text-slate-700">
          Use Google, a magic link, or email + password.
        </p>

        <div className="mt-6 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-sky-100" />
            <div className="text-xs text-slate-500">or</div>
            <div className="h-px flex-1 bg-sky-100" />
          </div>

          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                mode === "magic"
                  ? "border-sky-400 bg-sky-500 text-white"
                  : "border-sky-200 bg-white/70 text-sky-700"
              }`}
            >
              Magic link
            </button>
            <button
              onClick={() => setMode("password")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                mode === "password"
                  ? "border-sky-400 bg-sky-500 text-white"
                  : "border-sky-200 bg-white/70 text-sky-700"
              }`}
            >
              Password
            </button>
          </div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
          />

          {mode === "password" && (
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="mt-3 w-full rounded-xl border border-sky-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
            />
          )}

          <button
            onClick={mode === "magic" ? sendMagicLink : signInWithPassword}
            className="mt-4 w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-600"
          >
            {mode === "magic" ? "Send magic link" : "Sign in"}
          </button>

          {msg && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-3 text-slate-700">
              {msg}
            </div>
          )}

          <p className="mt-4 text-sm text-slate-600">
            New here?{" "}
            <a className="font-semibold text-sky-700 underline" href="/auth/signup">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
