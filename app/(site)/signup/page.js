"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user, hydrated, hasSupabase } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim() || null,
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }
      signIn(data.user?.name ?? username.trim(), (data.user?.email ?? email.trim()) || null);
      router.push("/");
    } catch (_) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (user) {
    router.replace("/");
    return null;
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide text-slate-900 dark:text-white">
        Sign up to Feelvie
      </h1>
      {hasSupabase ? (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <p className="mt-4 text-center text-xs text-slate-500 dark:text-white/50">or sign up with email</p>
        </>
      ) : (
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-white/50">
          Add <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">.env.local</code>, then restart the dev server to see &quot;Continue with Google&quot;.
        </p>
      )}
      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${hasSupabase ? "mt-6" : "mt-8"}`}>
        {error && (
          <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </p>
        )}
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
          required
        />
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <p className="text-xs text-slate-600 dark:text-white/60">
          By clicking Sign Up, you agree to Feelvie&apos;s Terms of Use (including arbitration provisions) and acknowledge that you have read our Privacy Policy.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-white/70">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-red-600 hover:underline dark:text-red-400">
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        >
          Continue as Guest
        </Link>
      </p>
    </div>
  );
}
